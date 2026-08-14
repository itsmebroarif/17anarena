const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: '17an Arena - Manajemen Lomba 17 Agustus (100% Offline Desktop)',
    icon: path.join(__dirname, '../public/favicon.ico'),
    backgroundColor: '#0f172a',
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false
    }
  });

  // Application menu with offline-friendly shortcuts
  const template = [
    {
      label: '17an Arena',
      submenu: [
        { label: 'Tentang Aplikasi', click: () => showAboutDialog() },
        { type: 'separator' },
        { label: 'Muat Ulang Halaman (Reload)', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: 'Layar Penuh (Full Screen Board)', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { type: 'separator' },
        { label: 'Keluar', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Navigasi Panggung',
      submenu: [
        { label: 'Dashboard Utama', click: () => navigateTo('/') },
        { label: 'Papan Nilai / TV Board', click: () => navigateTo('/competition-board') },
        { label: 'Pendaftaran Peserta', click: () => navigateTo('/registration') },
        { label: 'Lounge Peserta', click: () => navigateTo('/waiting-lounge') },
        { label: 'Input Skor Lomba', click: () => navigateTo('/scoring') },
        { label: 'Sertifikat Juara', click: () => navigateTo('/certificates') },
        { label: 'RAB & Kas Panitia', click: () => navigateTo('/rab') }
      ]
    },
    {
      label: 'Bantuan Offline',
      submenu: [
        {
          label: 'Buka DevTools (Inspeksi)',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.toggleDevTools()
        },
        {
          label: 'Panduan Operasional Offline 100%',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '100% Offline Guarantee',
              message: 'Aplikasi 17an Arena Desktop Offline',
              detail: 'Aplikasi ini dirancang untuk beroperasi secara mandiri tanpa memerlukan koneksi internet sama sekali. Seluruh data lomba, peserta, bagan pertandingan, dan laporan kas tersimpan aman di penyimpanan lokal komputer Anda.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Check if running from dev server or compiled production dist
  const devUrl = process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_START_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    // Load local compiled dist/index.html (100% offline file protocol)
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
  }

  // Intercept external links (WhatsApp links, external browser tabs)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('mailto:') || url.startsWith('https://wa.me')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function navigateTo(routePath) {
  if (!mainWindow) return;
  mainWindow.webContents.executeJavaScript(`
    if (window.location.hash) {
      window.location.hash = '#${routePath}';
    } else if (window.__ROUTER__) {
      window.__ROUTER__.push('${routePath}');
    }
  `);
}

function showAboutDialog() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Tentang 17an Arena Desktop',
    message: '17an Arena - Manajemen Lomba 17 Agustus',
    detail: 'Versi Desktop 100% Standalone Offline\n\nPlatform manajemen perlombaan kemerdekaan RI, live TV board proyektor, cetak sertifikat A4, manajemen kas panitia & pendaftaran peserta.\n\nDirancang untuk lapangan, panggung RT/RW, dan aula tanpa koneksi internet.'
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler for file export / native print dialogs if requested
ipcMain.handle('print-to-pdf', async (event, options) => {
  if (!mainWindow) return { success: false };
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Simpan Dokumen PDF Lomba',
      defaultPath: `17an-arena-dokumen-${Date.now()}.pdf`,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });

    if (filePath) {
      const data = await mainWindow.webContents.printToPDF(options || {});
      fs.writeFileSync(filePath, data);
      return { success: true, path: filePath };
    }
    return { success: false, cancelled: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
