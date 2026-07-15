import { createClient } from '@sanity/client';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import * as os from 'os';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET, // Usa development o production según el .env
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

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

async function main() {
  const excelPath = path.resolve(__dirname, '../../../inventario.xlsx');
  if (!fs.existsSync(excelPath)) {
    console.error(`Error: No se encontró ${excelPath}`);
    process.exit(1);
  }

  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const rows = xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

  const inventoryBySku: Record<string, string[]> = {};
  let currentSku = '';

  for (const row of rows) {
    if (row.Tipo === 'Item' && row.SKU) {
      currentSku = row.SKU.trim();
      if (!inventoryBySku[currentSku]) inventoryBySku[currentSku] = [];
    } else if (row.Tipo === 'Variacion' && row.Nombre && row.SKU) {
      const parts = row.SKU.split('-');
      const parentSku = parts.slice(0, parts.length - 1).join('-');
      const activeSku = currentSku || parentSku;

      if (!inventoryBySku[activeSku]) inventoryBySku[activeSku] = [];

      const nameParts = row.Nombre.trim().split(' ');
      nameParts.pop(); // Quitar la última palabra (la talla)
      const colorStr = nameParts.join(' ').toLowerCase();

      if (!inventoryBySku[activeSku].includes(colorStr)) {
        inventoryBySku[activeSku].push(colorStr);
      }
    }
  }

  const sanityProducts = await client.fetch(`*[_type == "product" && defined(sku)] { sku, name, variants }`);

  const missingSkus: string[] = [];
  const colorMismatches: string[] = [];
  const missingInSanity: string[] = [];

  const sanitySkus = sanityProducts.map((p: any) => p.sku.trim());
  for (const excelSku of Object.keys(inventoryBySku)) {
    if (!sanitySkus.includes(excelSku)) {
      const excelRow = rows.find(r => r.SKU && r.SKU.trim() === excelSku && r.Tipo === 'Item');
      
      // Ignorar si no hay unidades en inventario
      const quantity = excelRow ? (parseInt(excelRow.Cantidad) || 0) : 0;
      
      // Excluir bolsas, cajas y OC
      const name = excelRow ? (excelRow.Nombre || '').toLowerCase() : '';
      const category = excelRow ? (excelRow.Categoria || '').toUpperCase() : '';
      const skuUpper = excelSku.toUpperCase();
      const isStoreOnly = 
        name.includes('bolsa') || name.includes('caja') || 
        skuUpper.startsWith('OC') || 
        category === 'BOLSAS' || category === 'CAJAS' || category === 'OC';

      if (quantity > 0 && !isStoreOnly) {
        missingInSanity.push(`- **SKU**: ${excelSku} (${excelRow ? excelRow.Nombre : 'Nombre desconocido'}) - Qty: ${quantity}`);
      }
    }
  }

  for (const product of sanityProducts) {
    const cleanSku = product.sku.trim();
    const excelColors = inventoryBySku[cleanSku];

    if (!excelColors) {
      missingSkus.push(`- **SKU**: ${product.sku} (${product.name})`);
      continue;
    }

    if (!product.variants) continue;

    for (const variant of product.variants) {
      if (!variant.colorName) continue;

      const sanityColorName = normalizeColor(variant.colorName);

      let match = excelColors.find(c => {
        const normC = normalizeColor(c);
        return normC === sanityColorName || sanityColorName.includes(normC) || normC.includes(sanityColorName);
      });

      if (match === undefined && excelColors.length === 1 && product.variants.length === 1) {
        match = excelColors[0];
      }

      if (match === undefined) {
        colorMismatches.push(`- **SKU**: ${product.sku} | Sanity: \`${variant.colorName}\` ➔ Excel: \`[${excelColors.join(', ')}]\``);
      }
    }
  }

  // Generar reporte en Markdown
  let report = `# Reporte de Auditoría de Inventario\n\n`;
  report += `Este reporte compara los productos y colores en tu base de datos de Sanity contra los datos del archivo Excel.\n\n`;

  report += `## ❌ Productos en Sanity sin registro en Excel (${missingSkus.length})\n`;
  report += `Estos productos están creados en tu página web pero no se encontró su SKU en el Excel. Sus tallas NO se están actualizando.\n\n`;
  report += missingSkus.length > 0 ? missingSkus.join('\n') : "¡Excelente! Todos los productos de Sanity existen en el Excel.";
  report += `\n\n`;

  report += `## 📦 Productos en Excel sin registro en Sanity (${missingInSanity.length})\n`;
  report += `Estos productos existen en tu sistema administrativo pero no se encontraron en tu página web. Podrías haber olvidado subirlos.\n\n`;
  report += missingInSanity.length > 0 ? missingInSanity.join('\n') : "¡Felicidades! Todos tus productos físicos están publicados en la web.";
  report += `\n\n`;

  report += `## ⚠️ Discrepancias de Colores (${colorMismatches.length})\n`;
  report += `Para estos productos, el SKU existe en ambos lados, pero el nombre del color en Sanity no hace "match" con los colores en el Excel. Sus tallas NO se están actualizando.\n\n`;
  report += colorMismatches.length > 0 ? colorMismatches.join('\n') : "¡Perfecto! Todos los colores coinciden exactamente.";

  const reportPath = path.resolve(__dirname, '../../../reporte_inventario.md');
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Reporte generado en: ${reportPath}`);

  // Abrir automaticamente
  const platform = os.platform();
  if (platform === 'darwin') {
    exec(`open "${reportPath}"`);
  } else if (platform === 'win32') {
    exec(`start "" "${reportPath}"`);
  } else {
    exec(`xdg-open "${reportPath}"`);
  }
}

main().catch(console.error);
