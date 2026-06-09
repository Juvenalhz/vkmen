// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'jxemj9hs', // El ID de tu proyecto de Sanity
  dataset: 'production',
  useCdn: false, // true para que cargue a la velocidad de la luz usando el caché
  apiVersion: '2026-05-21', // Fecha de hoy para congelar la API
});

// Configuración del optimizador de imágenes de Sanity
const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}