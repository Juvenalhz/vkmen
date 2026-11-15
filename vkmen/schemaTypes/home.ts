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
      title: 'Imagen de Fondo del Hero (Escritorio / Pantallas Grandes)',
      type: 'image',
      description: 'Imagen horizontal optimizada para computadoras y laptops (Recomendado: 1920x1080 px).',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('La imagen de fondo de escritorio es obligatoria.'),
    }),
    defineField({
      name: 'heroImageMobile',
      title: 'Imagen de Fondo del Hero (Móvil / Teléfonos)',
      type: 'image',
      description: 'Imagen vertical exclusiva para teléfonos móviles (Recomendado: 1080x1920 px). Si no se sube, se usará la de escritorio.',
      options: {
        hotspot: true,
      },
    }),

    // --- SECCIÓN: PRECIOS DE EVENTO Y PRÓXIMAS OFERTAS ---
    defineField({
      name: 'enableEventPrices',
      title: '¿Activar Precios de Evento en la Tienda? (Botón Global)',
      type: 'boolean',
      description: 'Cuando está ENCENDIDO, todos los productos que tengan "Precio Evento" configurado se mostrarán rebajados en la tienda (calculando el % de descuento siempre sobre su Precio Regular). Mientras esté APAGADO, los precios de evento permanecen ocultos y solo se verán las ofertas inmediatas normales.',
      initialValue: false,
    }),
    defineField({
      name: 'upcomingOfferTitle',
      title: 'Título del Evento / Próxima Oferta',
      type: 'string',
      description: 'Texto principal mostrado cuando no hay ofertas activas (Ej: PRÓXIMAMENTE BLACK FRIDAY).',
      initialValue: 'PRÓXIMAMENTE BLACK FRIDAY',
    }),
    defineField({
      name: 'upcomingOfferSubtitle',
      title: 'Subtítulo / Mensaje Informativo',
      type: 'text',
      rows: 2,
      description: 'Texto secundario descriptivo de la promoción.',
      initialValue: 'Prepárate para nuestra mayor venta de la temporada. Descuentos exclusivos y piezas seleccionadas por tiempo limitado.',
    }),
    defineField({
      name: 'showUpcomingCountdown',
      title: '¿Mostrar reloj de cuenta regresiva?',
      type: 'boolean',
      description: 'Activa este interruptor si deseas mostrar el reloj con días, horas, minutos y segundos. Si lo apagas, solo se mostrará el anuncio editorial de "Próximamente".',
      initialValue: false,
    }),
    defineField({
      name: 'upcomingOfferDate',
      title: 'Fecha y Hora Objetivo (Cuenta Regresiva)',
      type: 'datetime',
      description: 'Fecha y hora exacta hacia la que contará el reloj regresivo en la tienda.',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      initialValue: () => '2026-11-27T00:00:00.000Z',
      hidden: ({ parent }) => !parent?.showUpcomingCountdown,
    }),
    defineField({
      name: 'showUpcomingTeaserBanner',
      title: '¿Mostrar banner de aviso debajo de las categorías?',
      type: 'boolean',
      description: 'Activa este interruptor si deseas mostrar la cinta dorada con aviso de próximas ofertas debajo de la barra de categorías.',
      initialValue: false,
    }),
    defineField({
      name: 'upcomingOfferBadge',
      title: 'Etiqueta Superior (Badge)',
      type: 'string',
      description: 'Texto pequeño sobre el título (Ej: EDICIÓN ESPECIAL).',
      initialValue: 'EDICIÓN ESPECIAL',
    }),
    defineField({
      name: 'upcomingOfferBgImage',
      title: 'Imagen de Fondo Opcional para la Pantalla de Ofertas',
      type: 'image',
      description: 'Imagen de fondo de lujo (opcional). Si no se sube, se usará el fondo oscuro característico de VK MEN con acentos dorados.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'forceShowUpcomingOffers',
      title: 'Forzar Visualización de Próximas Ofertas (Modo Pruebas)',
      type: 'boolean',
      description: 'Activa este interruptor para probar la pantalla de próximas ofertas en la tienda aunque haya productos en oferta activos.',
      initialValue: false,
    }),
  ],
});