#!/bin/bash
echo "==================================================="
echo "  17an Arena - Manajemen Lomba 17 Agustus Offline"
echo "==================================================="

if [ ! -d "node_modules" ]; then
    echo "[1/3] Menginstall dependencies..."
    npm install
fi

if [ ! -f "dist/index.html" ]; then
    echo "[2/3] Melakukan build frontend lokal..."
    npm run build
fi

echo "[3/3] Menjalankan 17an Arena Desktop Offline..."
npx electron .
