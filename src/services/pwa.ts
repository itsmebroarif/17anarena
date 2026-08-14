import { ref } from 'vue';

export const isOnline = ref(navigator.onLine);
export const deferredInstallPrompt = ref<any>(null);
export const isPwaInstalled = ref(
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as any).standalone === true
);
export const isSwRegistered = ref(false);

// Event Listeners for online/offline status
window.addEventListener('online', () => {
  isOnline.value = true;
});

window.addEventListener('offline', () => {
  isOnline.value = false;
});

// Capture install prompt event
window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredInstallPrompt.value = e;
  console.log('[PWA] beforeinstallprompt event captured.');
});

// Detect when PWA is installed
window.addEventListener('appinstalled', () => {
  isPwaInstalled.value = true;
  deferredInstallPrompt.value = null;
  console.log('[PWA] Application successfully installed as PWA.');
});

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          isSwRegistered.value = true;
          console.log('[PWA] ServiceWorker registration successful with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }
}

export async function promptInstallPwa() {
  if (deferredInstallPrompt.value) {
    deferredInstallPrompt.value.prompt();
    const choiceResult = await deferredInstallPrompt.value.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
      isPwaInstalled.value = true;
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }
    deferredInstallPrompt.value = null;
  }
}
