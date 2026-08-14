const { contextBridge, ipcRenderer } = require('electron');

// Expose safe offline desktop APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  version: process.versions.electron,
  printPage: () => window.print(),
  printToPDF: (options) => ipcRenderer.invoke('print-to-pdf', options),
  isOfflineDesktop: true
});
