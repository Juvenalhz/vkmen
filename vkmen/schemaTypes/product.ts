// schemaTypes/product.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Productos (VKMEN)',
  type: 'document',
  fields: [
    defineField({
      name: 'sku',
      title: 'SKU General / Código de Barra',
      type: 'string',
      description: 'Código raíz del producto (Ej: FRAN-ESS-01).',
      validation: (Rule) => Rule.required().error('El SKU es obligatorio para el control de inventario.'),
    }),
    defineField({
      name: 'name',
      title: 'Nombre del Producto',
      type: 'string',
      description: 'Ejemplo: Franela Oversized Premium Black',
      validation: (Rule) => Rule.required().error('El nombre del producto es obligatorio.'),
    }),
    defineField({
      name: 'id',
      title: 'ID Único (Slug / URL)',
      type: 'slug',
      description: 'Haz clic en "Generate" para crear la URL automáticamente basada en el nombre.',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('El slug es necesario para las URLs en Astro.'),
    }),
    defineField({
      name: 'price',
      title: 'Precio (EUR €)',
      type: 'number',
      description: 'Precio de venta en Euros (€).',
      validation: (Rule) => Rule.required().min(0).error('El precio debe ser mayor o igual a 0.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Jackets', value: 'jackets' },
          { title: 'Sets', value: 'sets' },
          { title: 'Chemises', value: 'chemises' },
          { title: 'Camisas', value: 'camisas' },
          { title: 'T-Shirts', value: 't-shirts' },
          { title: 'Sweaters', value: 'sweaters' },
          { title: 'Shorts', value: 'shorts' },
          { title: 'Jeans & Pantalones', value: 'jeans-pantalones' },
        ],
      },
      validation: (Rule) => Rule.required().error('Debes seleccionar una categoría.'),
    }),
    defineField({
      name: 'isFeatured',
      title: '¿Producto Destacado? (Más Vendidos)',
      type: 'boolean',
      description: 'Activa este interruptor para que aparezca en la página de inicio como tendencia.',
      initialValue: false,
    }),
    /* --- CAMBIO REALIZADO: Campo de Orden --- */
    defineField({
      name: 'order',
      title: 'Prioridad (Orden)',
      type: 'number',
      description: 'Número para ordenar. Los números bajos aparecerán primero (Ej: 1 = Top, 100 = Último).',
      initialValue: 100,
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true, // Esto oculta el campo para que no moleste en la edición
    }),
    /* ---------------------------------------- */
    defineField({
      name: 'variants',
      title: 'Variantes de Color e Inventario',
      type: 'array',
      description: 'Agrega aquí todos los colores. El inventario de tallas se maneja de forma independiente para cada color.',
      of: [
        {
          type: 'object',
          name: 'variant',
          title: 'Variante de Color',
          fields: [
            defineField({
              name: 'colorName',
              title: 'Nombre del Color',
              type: 'string',
              description: 'Ejemplo: Vinotinto, Negro, Off-White',
              validation: (Rule) => Rule.required().error('El nombre del color es obligatorio.'),
            }),
            defineField({
              name: 'hex',
              title: 'Selector de Color',
              type: 'color',
              description: 'Elige el tono visual para los círculos de la página.',
              validation: (Rule) => Rule.required().error('Debes seleccionar un color de la paleta.'),
            }),
            defineField({
              name: 'availableSizes',
              title: 'Tallas Disponibles (Stock Activo)',
              type: 'array',
              description: 'Selecciona las tallas activas para este color en la tienda.',
              of: [
                {
                  type: 'string',
                  options: {
                    list: [
                      { title: 'S', value: 'S' },
                      { title: 'M', value: 'M' },
                      { title: 'L', value: 'L' },
                      { title: 'XL', value: 'XL' },
                      { title: 'XXL', value: 'XXL' },
                    ],
                  },
                },
              ],
              options: {
                layout: 'tags',
              },
            }),
            defineField({
              name: 'images',
              title: 'Galería de Fotos para este Color',
              type: 'array',
              description: 'Selecciona múltiples fotos de la biblioteca. La primera será la de portada.',
              of: [{ type: 'image', options: { hotspot: true } }],
              options: {
                layout: 'grid',
              },
              validation: (Rule) => Rule.required().min(1).error('Debes seleccionar al menos 1 foto para este color.'),
            }),
          ],
          preview: {
            select: {
              title: 'colorName',
              media: 'images.0',
            },
            prepare(selection) {
              const { title, media } = selection;
              return {
                title: title || 'Color sin nombre',
                media: media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Debes agregar al menos una variante de color.'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'variants.0.images.0',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title,
        subtitle: subtitle ? `SKU: ${subtitle}` : 'Sin SKU',
        media: media,
      };
    },
  },
});