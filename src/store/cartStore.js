// src/store/cartStore.js
import { persistentAtom } from '@nanostores/persistent';

/**
 * Definición de la estructura de un ítem del carrito:
 * {
 * id: string (combinación de sku-color-talla para identificarlo de forma única)
 * sku: string
 * name: string
 * price: number
 * colorName: string
 * colorHex: string
 * size: string
 * image: string
 * quantity: number
 * }
 */

// Usamos persistentAtom para que Nanostores guarde automáticamente el carrito
// en el localStorage bajo la clave 'vkmen_cart' y mantenga el estado entre recargas de página.
// El tercer argumento define cómo serializar/deserializar los datos (JSON en este caso).
export const cartItems = persistentAtom('vkmen_cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// --- FUNCIONES DE CONTROL (ACCIONES) ---

// Añadir un producto al carrito
export function addCartItem(item) {
  const currentItems = cartItems.get();
  
  // Generamos un ID único combinando SKU, Color y Talla
  const uniqueId = `${item.sku}-${item.colorName}-${item.size}`;

  // Verificamos si ese producto exacto (mismo color y misma talla) ya está en el carrito
  const existingItemIndex = currentItems.findIndex(i => i.id === uniqueId);

  if (existingItemIndex > -1) {
    // Si ya existe, incrementamos la cantidad
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex].quantity += 1;
    cartItems.set(updatedItems);
  } else {
    // Si es nuevo, lo agregamos con cantidad 1
    cartItems.set([...currentItems, { ...item, id: uniqueId, quantity: 1 }]);
  }
}

// Eliminar un producto por completo del carrito
export function removeCartItem(id) {
  const currentItems = cartItems.get();
  const filteredItems = currentItems.filter(item => item.id !== id);
  cartItems.set(filteredItems);
}

// Vaciar el carrito por completo (por ejemplo, después de enviar el pedido)
export function clearCart() {
  cartItems.set([]);
}