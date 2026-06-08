// sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { colorInput } from '@sanity/color-input';
import { media } from 'sanity-plugin-media';
import { structure } from '../vkmen/schemaTypes/structure'; 
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export default defineConfig({
  name: 'default',
  title: 'VKMEN Store',
  projectId: 'jxemj9hs',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title('Contenido')
          .items([
            // 1. Catálogo ordenable con la configuración correcta
            orderableDocumentListDeskItem({
              type: 'product',
              title: 'Catálogo Ordenable (Drag & Drop)',
              icon: () => '📦',
              S,
              context,
              params: { slug: 'orderRank' }
            }),
            S.divider(),
            // 2. Gestión completa usando 'as any' para silenciar el error de TS
            S.listItem()
              .title('Gestión Completa')
              .child(structure(S, context) as any) 
          ]);
      },
    }),
    colorInput(),
    media()
  ],

  schema: {
    types: schemaTypes,
  },
});