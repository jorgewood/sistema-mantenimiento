@echo off
title Sistema de Mantenimiento Escolar
color 0A

echo ========================================
echo  SISTEMA DE MANTENIMIENTO ESCOLAR
echo ========================================
echo.
echo  🚀 Iniciando servidor...
echo.

cd /d "%~dp0"

echo  📁 Directorio: %cd%
echo  📦 Instalando dependencias si es necesario...
echo.

call npm install

echo.
echo  ✅ Dependencias instaladas
echo  🌐 Iniciando servidor...
echo.

call npm start

pause