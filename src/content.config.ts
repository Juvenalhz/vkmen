import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // <-- Esta es la nueva pieza clave

const productosCollection = defineCollection({
  // En Astro 5+, usamos loader para decirle dónde están los archivos
  loader: glob({ pattern: "**/*.json", base: "./src/content/productos" }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    precio: z.number(),
    categoria: z.string(),
    descripcion: z.string().optional(),
    colores: z.array(z.object({
      nombre: z.string(),
      codigoHex: z.string(),
      fotos: z.array(z.string())
    })),
    stock: z.boolean().default(true)
  })
});

export const collections = {
  'productos': productosCollection,
};