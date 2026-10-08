// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'jxemj9hs', // El ID de tu proyecto de Sanity
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Siempre false para consultar inventario fresco en tiempo real
  apiVersion: '2026-05-21', // Fecha de hoy para congelar la API
});

// Configuración del optimizador de imágenes de Sanity
const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}

// Tipos TypeScript para Productos e Inventario (incluyendo Bundles / Productos Receta)
export interface ReferencedProduct {
  sku: string;
  name: string;
  category?: string;
  price?: number;
  isOnSale?: boolean;
  offerPrice?: number;
  variants?: Array<{
    colorName: string;
    colorHex?: string;
    availableSizes: string[];
    images?: Array<{ 
      asset: { 
        url: string;
        metadata?: {
          dimensions?: {
            aspectRatio?: number;
            width?: number;
            height?: number;
          };
        };
      };
    }>;
  }>;
}

export interface Variant {
  colorName: string;
  colorHex: string;
  availableSizes: string[];
  images: Array<{ 
    asset: { 
      url: string;
      metadata?: {
        dimensions?: {
          aspectRatio?: number;
          width?: number;
          height?: number;
        };
      };
    };
  }>;
}

export interface Product {
  sku: string;
  name: string;
  category: string; 
  price: number;
  isOnSale?: boolean;
  offerPrice?: number;
  hideFromCatalog?: boolean;
  isBundle?: boolean;
  topProduct?: ReferencedProduct;
  bottomProduct?: ReferencedProduct;
  variants: Variant[];
}