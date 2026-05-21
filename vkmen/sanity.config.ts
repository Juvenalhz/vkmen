

// sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure'; // o 'sanity/desk' según tu versión
import { schemaTypes } from './schemaTypes';
import { colorInput } from '@sanity/color-input';
import { media } from 'sanity-plugin-media';
import { structure } from '../vkmen/schemaTypes/structure'; // <-- 1. Importamos tu menú organizado

export default defineConfig({
  name: 'default',
  title: 'VKMEN Store',
  projectId: 'jxemj9hs',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: structure, // <-- 2. Le inyectamos la estructura limpia aquí
    }),
    colorInput(),
    media()
  ],

  schema: {
    types: schemaTypes,
  },
});