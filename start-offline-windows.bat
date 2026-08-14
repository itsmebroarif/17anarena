@echo off
title 17an Arena - Launcher Desktop 100% Offline
echo ===================================================
echo   17an Arena - Manajemen Lomba 17 Agustus Offline
echo ===================================================
echo Menyiapkan aplikasi desktop offline...

IF NOT EXIST "node_modules" (
    echo [1/3] Menginstall dependencies...
    call npm install
)

IF NOT EXIST "dist\index.html" (
    echo [2/3] Melakukan build aset frontend lokal...
    call npm run build
)

echo [3/3] Membuka 17an Arena Desktop Offline...
call npx electron .

pause
