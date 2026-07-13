import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production', // Apuntamos a producción directamente para arreglar el problema
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

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

async function main() {
  console.log('⏳ Iniciando ordenamiento de tallas en PRODUCCIÓN...');

  const sanityProducts = await client.fetch(`*[_type == "product"] { _id, sku, variants }`);
  
  let transaction = client.transaction();
  let patchCount = 0;

  for (const product of sanityProducts) {
    if (!product.variants || !Array.isArray(product.variants)) continue;

    let needsUpdate = false;
    const newVariants = [...product.variants];

    for (let i = 0; i < newVariants.length; i++) {
      const variant = newVariants[i];
      if (!variant.availableSizes || variant.availableSizes.length <= 1) continue;

      const currentSizes = [...variant.availableSizes];
      const sortedSizes = sortSizes(currentSizes);

      if (JSON.stringify(currentSizes) !== JSON.stringify(sortedSizes)) {
        console.log(`✅ Ordenando SKU ${product.sku} (${variant.colorName}): [${currentSizes.join(', ')}] -> [${sortedSizes.join(', ')}]`);
        newVariants[i] = {
          ...variant,
          availableSizes: sortedSizes
        };
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      transaction.patch(product._id, (p) => p.set({ variants: newVariants }));
      patchCount++;
    }
  }

  if (patchCount > 0) {
    console.log(`🚀 Ejecutando re-ordenamiento en ${patchCount} productos...`);
    await transaction.commit();
    console.log('✅ RE-ORDENAMIENTO COMPLETADO en Producción.');
  } else {
    console.log('✨ Todas las tallas ya estaban ordenadas correctamente.');
  }
}

main().catch(console.error);
