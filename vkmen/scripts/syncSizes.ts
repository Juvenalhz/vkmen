import { createClient } from '@sanity/client';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!token || token === 'TU_TOKEN_AQUI_POR_FAVOR') {
  console.error('❌ Error: Por favor configura SANITY_API_TOKEN en el archivo vkmen/.env');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false, // Necesitamos leer la base de datos fresca, no del caché
  apiVersion: '2023-05-03',
  token,
});

async function main() {
  console.log('🔄 Iniciando sincronización de tallas desde Excel...');

  // El excel está en la raíz del proyecto principal
  const excelPath = path.resolve(__dirname, '../../../inventario.xlsx');
  
  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Error: No se encontró el archivo ${excelPath}`);
    process.exit(1);
  }

  // 1. Leer el archivo Excel
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const rows = xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

  // 2. Agrupar inventario por SKU y Color
  const inventoryBySku: Record<string, Record<string, string[]>> = {};
  let currentSku = '';

  for (const row of rows) {
    if (row.Tipo === 'Item' && row.SKU) {
      currentSku = row.SKU.trim();
      if (!inventoryBySku[currentSku]) {
        inventoryBySku[currentSku] = {};
      }
    } else if (row.Tipo === 'Variacion' && row.Nombre && row.SKU) {
      const parts = row.SKU.split('-');
      const parentSku = parts.slice(0, parts.length - 1).join('-'); // 'I-36884-NS' -> 'I-36884'
      const activeSku = currentSku || parentSku;

      if (!inventoryBySku[activeSku]) {
        inventoryBySku[activeSku] = {};
      }

      // El nombre es ej: "negro s"
      const nameParts = row.Nombre.trim().split(' ');
      const sizeStr = nameParts.pop()?.toUpperCase(); // La última palabra suele ser la talla
      const colorStr = nameParts.join(' ').toLowerCase(); // El resto es el color

      if (sizeStr !== undefined) {
        if (!inventoryBySku[activeSku][colorStr]) {
          inventoryBySku[activeSku][colorStr] = [];
        }
        
        // Agregar talla si hay inventario mayor a 0
        const quantity = parseInt(row.Cantidad) || 0;
        if (quantity > 0) {
          if (!inventoryBySku[activeSku][colorStr].includes(sizeStr)) {
            inventoryBySku[activeSku][colorStr].push(sizeStr);
          }
        }
      }
    }
  }

  console.log(`📦 Se procesaron ${Object.keys(inventoryBySku).length} SKUs base del Excel.`);

  // 3. Obtener productos de Sanity
  console.log('☁️ Descargando productos de Sanity...');
  const sanityProducts = await client.fetch(`*[_type == "product" && defined(sku)] {
    _id,
    sku,
    variants
  }`);

  console.log(`☁️ Se encontraron ${sanityProducts.length} productos en Sanity con SKU definido.`);

  const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];
  function sortSizes(sizes: string[]): string[] {
    if (!sizes || sizes.length === 0) return sizes;
    return [...sizes].sort((a, b) => {
      const idxA = SIZE_ORDER.indexOf(a.toUpperCase());
      const idxB = SIZE_ORDER.indexOf(b.toUpperCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }

  const COLOR_DICTIONARY: Record<string, string> = {
    'blanca': 'blanco',
    'negra': 'negro',
    'roja': 'rojo',
    'amarilla': 'amarillo',
  };
  function normalizeColor(color: string): string {
    const c = color.toLowerCase().trim();
    return COLOR_DICTIONARY[c] || c;
  }

  // 4. Comparar y preparar Transacción de actualización
  let transaction = client.transaction();
  let patchCount = 0;

  for (const product of sanityProducts) {
    const cleanSku = product.sku.trim();
    const excelData = inventoryBySku[cleanSku];
    if (!excelData) continue; // Si no está en el excel, lo omitimos

    if (!product.variants || !Array.isArray(product.variants)) continue;

    let productNeedsUpdate = false;
    const newVariants = [...product.variants];

    for (let i = 0; i < newVariants.length; i++) {
      const variant = newVariants[i];
      if (!variant.colorName) continue;

      const sanityColorName = normalizeColor(variant.colorName);

      // Buscar match de color
      const excelColorKeys = Object.keys(excelData);
      let matchingColorKey = excelColorKeys.find(
        (c) => {
          const normC = normalizeColor(c);
          return normC === sanityColorName || sanityColorName.includes(normC) || normC.includes(sanityColorName);
        }
      );

      if (matchingColorKey === undefined && excelColorKeys.length === 1 && newVariants.length === 1) {
        // Si solo hay un color en Sanity y un "color" en el Excel (ej: la palabra 'talla'), asumimos que coinciden
        matchingColorKey = excelColorKeys[0];
      }

      if (matchingColorKey === undefined) {
        console.log(`⚠️ Advertencia: No se pudo emparejar el color '${variant.colorName}' (SKU: ${product.sku}) con los datos del Excel [${excelColorKeys.join(', ')}]. Saltando...`);
        continue; // Es más seguro saltar que borrar todo si no estamos seguros del match
      }

      const excelSizes = excelData[matchingColorKey] || [];

      // Ordenar para comparar independientemente del orden
      const currentSizes = sortSizes([...(variant.availableSizes || [])]);
      const newSizes = sortSizes([...excelSizes]);

      if (JSON.stringify(currentSizes) !== JSON.stringify(newSizes)) {
        console.log(`📝 SKU ${product.sku} (${variant.colorName}): Tallas [${currentSizes.join(', ')}] -> [${newSizes.join(', ')}]`);
        newVariants[i] = {
          ...variant,
          availableSizes: newSizes.length > 0 ? newSizes : undefined // Limpiar si no hay
        };
        productNeedsUpdate = true;
      }
    }

    if (productNeedsUpdate) {
      transaction.patch(product._id, (p) => p.set({ variants: newVariants }));
      patchCount++;
    }
  }

  if (patchCount > 0) {
    console.log(`🚀 Enviando actualizaciones de ${patchCount} productos a Sanity...`);
    await transaction.commit();
    console.log('✅ ¡Sincronización completada con éxito!');
  } else {
    console.log('✨ Todo está actualizado. No hay cambios de tallas.');
  }
}

main().catch((err) => {
  console.error('❌ Ocurrió un error no controlado:', err);
  process.exit(1);
});
