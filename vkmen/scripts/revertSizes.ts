import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

const logData = `
📝 SKU I-36368 (Negro): Tallas [L, M, S, XL] -> []
📝 SKU ACR-155M (Negro): Tallas [S] -> []
📝 SKU MTS-117043 (Negro): Tallas [L, M, S] -> []
📝 SKU MTS-117043 (Blanco): Tallas [M] -> []
📝 SKU MTS-117043 (Beige): Tallas [M, S, XL] -> [M, XL]
📝 SKU MM-13670 (Beige): Tallas [L] -> []
📝 SKU I-36492 (Beige): Tallas [L, M, S, XL] -> []
📝 SKU I-36492 (Verde): Tallas [L, M, S, XL] -> []
📝 SKU JMA16500 (Azul): Tallas [30, 32, 34, 36, 38] -> []
📝 SKU MTS-120227 (Beige): Tallas [L, M, XL] -> []
📝 SKU MTS-120227 (Khaki): Tallas [L, M, XL] -> []
📝 SKU LXR-9646MO (Azul): Tallas [34, 36] -> []
📝 SKU EDD-P-4280M (Khaki): Tallas [L, M, XL] -> []
📝 SKU LBS-9143M (Marron): Tallas [M, S] -> []
📝 SKU MTS-120220 (Beige): Tallas [L, M, S, XL] -> []
📝 SKU MTS-113550 (Beige): Tallas [L, M, XL] -> []
📝 SKU MTS-113550 (Rojo): Tallas [L, XL] -> []
📝 SKU MTS-113550 (Khaki): Tallas [L, M, XL] -> []
📝 SKU MTS-113550 (Negro): Tallas [L, M, XL] -> []
📝 SKU I-36796 (Marron): Tallas [L, M, S, XL] -> [L, S, XL]
📝 SKU FI04-JALUJA (Off-White): Tallas [L, M, S] -> []
📝 SKU MJK-115242 (Negro): Tallas [S, XL] -> [S]
📝 SKU MJK-115242 (Caramelo): Tallas [L, S] -> [S]
📝 SKU MJK-115242 (Crema): Tallas [L, M, S, XL] -> [L, S, XL]
📝 SKU MTS-112210 (Blanco): Tallas [L, M, XL] -> []
📝 SKU MTS-112210 (Negro): Tallas [L, M, S] -> []
📝 SKU MTS-112210 (Rojo): Tallas [L, S, XL] -> []
📝 SKU MTS-116475 (Blanco): Tallas [L, M, XL] -> []
📝 SKU MTS-116475 (Negro): Tallas [L, M, S] -> []
📝 SKU LBD-PO-9768M (Beige): Tallas [L, XL] -> []
📝 SKU LBD-PO-9768M (Negro): Tallas [L, M, S] -> []
📝 SKU PAI-0852M (Blanco): Tallas [XL] -> []
📝 SKU PAI-0852M (Negro): Tallas [L, M, S, XL] -> []
📝 SKU MI-34622 (Beige): Tallas [30, 32, 34] -> []
📝 SKU FASH300-481 (Crema): Tallas [L, M, S, XL] -> []
📝 SKU MTS-117830 (Negro): Tallas [L] -> []
📝 SKU MTS-117830 (Blanco): Tallas [S] -> []
📝 SKU FASH300-478 (Negro): Tallas [L, M, S] -> [M, S]
📝 SKU ALI-0798MRL (Negro): Tallas [30, 32, 34, 36, 38] -> []
📝 SKU I-36512 (Negro): Tallas [L, S, XL] -> [L, S]
📝 SKU I-36512 (Beige): Tallas [L, M, S, XL] -> []
📝 SKU MTS-443536 (Negro): Tallas [L, M, S] -> []
📝 SKU MSH-115243 (Negro): Tallas [M] -> []
📝 SKU CAM-0906M (Verde): Tallas [S, XL] -> [S]
📝 SKU MIT-37563 (Vinotinto): Tallas [L, M, S, XL] -> []
📝 SKU MIT-37579 (Negro): Tallas [L, M, S, XL] -> [L, M, S]
📝 SKU MTS-230009 (Negro): Tallas [S, XL] -> []
📝 SKU LIN-1028MS (Ladrillo): Tallas [XL] -> []
📝 SKU ZAA-0791M (Negro): Tallas [L, M, S, XL] -> []
📝 SKU ZAA-0791M (Blanco): Tallas [L, M, S, XL] -> []
📝 SKU FI05-JAREJA (Plateado): Tallas [L, M, S, XL] -> []
📝 SKU MSS-117706 (Khaki): Tallas [L, XL] -> []
📝 SKU MSS-120216 (Beige): Tallas [L, M, S, XL] -> []
📝 SKU LLI-9249MRX (Off-White): Tallas [30, 32, 34, 36, 38] -> []
📝 SKU PFK8904 (Gris): Tallas [32, 34, 36, 38] -> []
📝 SKU MI-36328 (Rojo): Tallas [L, M, S, XL] -> []
📝 SKU MI-36328 (Verde): Tallas [ M, L, S, XL] -> [L, M, S]
📝 SKU MI-36328 (Gris Ocuro): Tallas [L, M, S, XL] -> []
📝 SKU PAI-0854M (Blanco): Tallas [L, M, S, XL] -> []
📝 SKU PAI-0854M (Beige): Tallas [L, M, S, XL] -> []
📝 SKU PAI-0854M (Negro): Tallas [L, M, S, XL] -> []
📝 SKU EFG-S-4360M (Turquesa): Tallas [L, M, S, XL] -> []
📝 SKU MI-37425 (Verde): Tallas [L, M] -> []
📝 SKU FI01-CACAJC (Khaki): Tallas [L, M, S, XL] -> []
📝 SKU MID-36588 (Azul): Tallas [L, M, S, XL] -> []
📝 SKU MID-36588 (Negro): Tallas [L, M] -> [M]
📝 SKU JMA16306 (Azul): Tallas [30, 32, 34, 36, 38] -> []
📝 SKU EJT-5523MRX (Beige): Tallas [30, 32, 36, 38] -> []
📝 SKU I-36898 (Negro): Tallas [L, M, S, XL] -> [M, S, XL]
📝 SKU I-36898 (Beige): Tallas [L, M, S] -> []
📝 SKU MDD-AC-0599M (Verde): Tallas [L, XL] -> []
📝 SKU FI02-SEAZCO (Negro): Tallas [M, S] -> []
📝 SKU FI02-SEAZCO (Azul): Tallas [L, S, XL] -> []
`;

async function main() {
  console.log('⏳ Iniciando proceso de REVERSIÓN de tallas...');
  
  const lines = logData.trim().split('\n');
  const revertMap: Record<string, Record<string, string[]>> = {};

  for (const line of lines) {
    if (!line.startsWith('📝')) continue;
    
    // Ejemplo: 📝 SKU I-36368 (Negro): Tallas [L, M, S, XL] -> []
    // Usaremos Regex para extraer SKU, Color y Tallas antiguas
    const regex = /SKU (.+) \((.+)\): Tallas \[(.*?)\]/;
    const match = line.match(regex);
    
    if (match) {
      const sku = match[1].trim();
      const color = match[2].trim();
      const oldSizesStr = match[3].trim();
      
      const oldSizes = oldSizesStr ? oldSizesStr.split(',').map(s => s.trim()) : [];

      if (!revertMap[sku]) revertMap[sku] = {};
      revertMap[sku][color] = oldSizes;
    }
  }

  const skusToFetch = Object.keys(revertMap);
  console.log(`📦 Preparando para revertir ${skusToFetch.length} productos base.`);

  // Obtener productos de Sanity
  const sanityProducts = await client.fetch(
    `*[_type == "product" && sku in $skus] { _id, sku, variants }`,
    { skus: skusToFetch }
  );

  let transaction = client.transaction();
  let patchCount = 0;

  for (const product of sanityProducts) {
    const skuMap = revertMap[product.sku];
    if (!skuMap || !product.variants) continue;

    let needsUpdate = false;
    const newVariants = [...product.variants];

    for (let i = 0; i < newVariants.length; i++) {
      const variant = newVariants[i];
      if (!variant.colorName) continue;

      const colorInMap = Object.keys(skuMap).find(
        (c) => c.toLowerCase() === variant.colorName.toLowerCase()
      );

      if (colorInMap) {
        const oldSizes = skuMap[colorInMap];
        
        // Comparamos
        const currentSizes = [...(variant.availableSizes || [])].sort();
        const expectedSizes = [...oldSizes].sort();

        if (JSON.stringify(currentSizes) !== JSON.stringify(expectedSizes)) {
          console.log(`✅ Restaurando SKU ${product.sku} (${variant.colorName}): -> [${expectedSizes.join(', ')}]`);
          newVariants[i] = {
            ...variant,
            availableSizes: expectedSizes.length > 0 ? expectedSizes : undefined
          };
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      transaction.patch(product._id, (p) => p.set({ variants: newVariants }));
      patchCount++;
    }
  }

  if (patchCount > 0) {
    console.log(`🚀 Ejecutando reversión en ${patchCount} productos...`);
    await transaction.commit();
    console.log('✅ REVERSIÓN COMPLETADA. La base de datos ha vuelto a la normalidad.');
  } else {
    console.log('✨ No se requirió ninguna reversión. Todo parece estar correcto.');
  }
}

main().catch(console.error);
