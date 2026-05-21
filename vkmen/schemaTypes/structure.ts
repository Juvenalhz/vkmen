// structure.ts
import { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Panel de Control VKMEN')
    .items([
      // 1. SECCIÓN DE DISEÑO DE LA PÁGINA (HERO)
      S.listItem()
        .title('Diseño de Inicio (Hero)')
        .icon(() => '✨')
        .child(
          S.document()
            .schemaType('homeSettings')
            .documentId('homeSettings')
            .title('Editar Contenido del Hero')
        ),

      S.divider(), // Línea divisoria visual

      // 2. SECCIÓN DE INVENTARIO GENERAL
      S.documentTypeListItem('product')
        .title('Todos los Productos')
        .icon(() => '📦'),

      S.divider(), // Otra línea divisoria

      // 3. CARPETAS AUTOMÁTICAS POR CATEGORÍA
      S.listItem()
        .title('Jackets')
        .icon(() => '🧥')
        .child(
          S.documentList()
            .title('Colección de Jackets')
            .filter('_type == "product" && category == "jackets"')
        ),

      S.listItem()
        .title('Sets')
        .icon(() => '👕')
        .child(
          S.documentList()
            .title('Colección de Sets')
            .filter('_type == "product" && category == "sets"')
        ),

      S.listItem()
        .title('Chemises')
        .icon(() => '👕')
        .child(
          S.documentList()
            .title('Colección de Chemises')
            .filter('_type == "product" && category == "chemises"')
        ),

      S.listItem()
        .title('Camisas')
        .icon(() => '👔')
        .child(
          S.documentList()
            .title('Colección de Camisas')
            .filter('_type == "product" && category == "camisas"')
        ),

      S.listItem()
        .title('T-Shirts')
        .icon(() => '👕')
        .child(
          S.documentList()
            .title('Colección de T-Shirts')
            .filter('_type == "product" && category == "t-shirts"')
        ),

      S.listItem()
        .title('Sweaters')
        .icon(() => '🧥')
        .child(
          S.documentList()
            .title('Colección de Sweaters')
            .filter('_type == "product" && category == "sweaters"')
        ),

      S.listItem()
        .title('Shorts')
        .icon(() => '🩳')
        .child(
          S.documentList()
            .title('Colección de Shorts')
            .filter('_type == "product" && category == "shorts"')
        ),

      S.listItem()
        .title('Jeans & Pantalones')
        .icon(() => '👖')
        .child(
          S.documentList()
            .title('Colección de Jeans & Pantalones')
            .filter('_type == "product" && category == "jeans-pantalones"')
        ),
    ]);