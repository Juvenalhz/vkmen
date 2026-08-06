// schemaTypes/home.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homeSettings',
  title: 'Configuración General (Hero, Logo & Moneda)',
  type: 'document',
  fields: [
    // --- MONEDA GLOBAL DE LA TIENDA ---
    defineField({
      name: 'currency',
      title: 'Moneda Global de la Tienda',
      type: 'string',
      description: 'Selecciona la divisa en la que se mostrarán todos los precios en el catálogo y los pedidos.',
      options: {
        list: [
          { title: 'Euro (€)', value: 'EUR' },
          { title: 'Dólar ($)', value: 'USD' },
        ],
        layout: 'radio',
      },
      initialValue: 'EUR',
      validation: (Rule) => Rule.required().error('Debes seleccionar una moneda global.'),
    }),

    // --- LOGO EXCLUSIVO PARA EL SCROLL (TEXTO -> IMAGEN) ---
    defineField({
      name: 'logoScroll',
      title: 'Logo del Scroll (Navbar Activa)',
      type: 'image',
      description: 'La imagen que aparecerá en el header reemplazando al texto de la marca cuando el usuario baje en la página.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('El logo para el scroll es obligatorio.'),
    }),
    
    // --- TEXTOS E IMÁGENES DEL HERO REAL DE VKMEN ---
    defineField({
      name: 'heroSub',
      title: 'Subtítulo del Hero (Texto pequeño superior)',
      type: 'string',
      description: 'Ejemplo: Urban Luxury • Caracas Collection',
      validation: (Rule) => Rule.required().error('El subtítulo es obligatorio.'),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título Principal del Hero',
      type: 'text',
      rows: 2,
      description: 'Puedes usar <br/> en el panel de Sanity si quieres forzar el salto de línea. Ejemplo: The Future is<br/>Modern.',
      validation: (Rule) => Rule.required().error('El título es obligatorio.'),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen de Fondo del Hero',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('La imagen de fondo es obligatoria.'),
    }),
  ],
});