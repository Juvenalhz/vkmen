// ==============================================================================
// N8N CODE NODE: Transformar JSON de Fina a mapa de SKU / Tallas para Sanity
// Copia y pega este código dentro del nodo 'Code' de tu workflow en n8n
// ==============================================================================

const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];

function sortSizes(sizes) {
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

const COLOR_DICTIONARY = {
  'blanca': 'blanco',
  'negra': 'negro',
  'roja': 'rojo',
  'amarilla': 'amarillo',
};

function normalizeColor(color) {
  const c = color.toLowerCase().trim();
  return COLOR_DICTIONARY[c] || c;
}

// 1. Obtener los items devueltos por el nodo anterior de Fina API
const items = $input.all();
const inventoryBySku = {};

for (const item of items) {
  const data = item.json;
  const rawSku = data.SKU || data.sku || '';
  const name = data.Nombre || data.nombre || data.name || '';
  const rawQuantity = parseInt(data.Cantidad || data.cantidad || data.stock || 0);
  const defects = parseInt(data.defectos || data.defecto || data.Defectos || data.Defecto || 0);
  const quantity = rawQuantity - defects;

  if (!rawSku || quantity <= 0) continue;

  const parts = rawSku.trim().split('-');
  const baseSku = parts.length > 2 ? parts.slice(0, parts.length - 1).join('-') : parts[0];

  if (!inventoryBySku[baseSku]) {
    inventoryBySku[baseSku] = {};
  }

  const nameParts = name.trim().split(' ');
  const sizeStr = nameParts.pop()?.toUpperCase();
  const colorStr = nameParts.join(' ').toLowerCase();

  if (sizeStr) {
    if (!inventoryBySku[baseSku][colorStr]) {
      inventoryBySku[baseSku][colorStr] = [];
    }
    if (!inventoryBySku[baseSku][colorStr].includes(sizeStr)) {
      inventoryBySku[baseSku][colorStr].push(sizeStr);
    }
  }
}

// Ordenar las tallas resultantes
for (const sku in inventoryBySku) {
  for (const color in inventoryBySku[sku]) {
    inventoryBySku[sku][color] = sortSizes(inventoryBySku[sku][color]);
  }
}

// Retornar la estructura lista para procesar en Sanity
return [{ json: { inventoryBySku } }];
