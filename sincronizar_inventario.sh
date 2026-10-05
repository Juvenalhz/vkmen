#!/usr/bin/env bash

# Ir al directorio del proyecto vkmen-web
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "   🔄 INICIANDO SINCRONIZACIÓN DE INVENTARIO"
echo "=================================================="
echo ""

# Ejecutar el script de sincronización con tsx
npx tsx vkmen/scripts/syncSizes.ts

echo ""
echo "=================================================="
echo "   ✨ PROCESO FINALIZADO"
echo "=================================================="
echo ""

# Pausa para que el usuario pueda ver el resultado en pantalla
read -p "Presiona Enter para cerrar esta ventana..."
