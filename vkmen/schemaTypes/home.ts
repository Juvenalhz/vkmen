// schemaTypes/home.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homeSettings',
  title: 'Configuración Inicio (Hero)',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Título Principal del Hero',
      type: 'string',
      description: 'Ejemplo: NUEVA COLECCIÓN OLD MONEY',
      validation: (Rule) => Rule.required().error('El título es obligatorio.'),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo o Descripción',
      type: 'text',
      rows: 3,
      description: 'Un texto corto que enganche abajo del título.',
      validation: (Rule) => Rule.required().error('La descripción es obligatoria.'),
    }),
    defineField({
      name: 'buttonText',
      title: 'Texto del Botón',
      type: 'string',
      description: 'Ejemplo: Ver Catálogo o Comprar Ahora',
      validation: (Rule) => Rule.required().error('El texto del botón es obligatorio.'),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen de Fondo del Hero',
      type: 'image',
      options: {
        hotspot: true, // Para ajustar el enfoque de la foto en móviles y PC
      },
      validation: (Rule) => Rule.required().error('La imagen de fondo es obligatoria.'),
    }),
  ],
});