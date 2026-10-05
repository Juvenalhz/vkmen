@echo off
title Sincronizar Inventario VKMEN
cd /d "%~dp0"
echo ==================================================
echo    🔄 INICIANDO SINCRONIZACIÓN DE INVENTARIO
echo ==================================================
echo.

call npx tsx vkmen/scripts/syncSizes.ts

echo.
echo ==================================================
echo    ✨ PROCESO FINALIZADO
echo ==================================================
echo.
pause
