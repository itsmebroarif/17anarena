<template>
  <div class="space-y-2">
    <!-- Banner 1: PWA Install Prompt Banner for Desktop / Mobile -->
    <div
      v-if="canInstall && !isPwaInstalled && !isBannerDismissed"
      class="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white px-4 py-3 shadow-md border-b border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl flex-shrink-0 shadow-xs border border-white/30">
          <i class="bi bi-laptop-fill text-amber-300"></i>
        </div>
        <div>
          <h4 class="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
            <span>Download & Install 17an Arena di Laptop / HP!</span>
            <span class="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">PWA Ready</span>
          </h4>
          <p class="text-[11px] text-amber-100 mt-0.5">
            Dapatkan aplikasi desktop resmi agar bisa dijalankan 100% Offline tanpa koneksi internet di lokasi acara!
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          @click="triggerInstall"
          class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <i class="bi bi-download"></i>
          <span>Install Aplikasi Sekarang</span>
        </button>

        <button
          @click="isBannerDismissed = true"
          class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          title="Tutup pengumuman"
        >
          <i class="bi bi-x-lg text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Banner 2: Offline Status Alert Bar -->
    <div
      v-if="!isOnline"
      class="bg-slate-900 text-amber-300 px-4 py-2 text-xs font-bold border-b border-amber-500/40 flex items-center justify-between shadow-xs"
    >
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
        <i class="bi bi-wifi-off text-amber-400 text-sm"></i>
        <span>Mode Offline Aktif — Seluruh fitur & data disimpan di memori lokal Laptop.</span>
      </div>
      <span class="text-[10px] font-mono uppercase bg-amber-400/20 px-2 py-0.5 rounded text-amber-200 border border-amber-400/30">
        Standalone Local Database
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { isOnline, deferredInstallPrompt, isPwaInstalled, promptInstallPwa } from '../services/pwa';
import Swal from 'sweetalert2';

const isBannerDismissed = ref(false);

const canInstall = computed(() => !!deferredInstallPrompt.value);

async function triggerInstall() {
  await promptInstallPwa();
  if (isPwaInstalled.value) {
    Swal.fire({
      icon: 'success',
      title: 'Aplikasi Berhasil Di-install! 🎉',
      text: '17an Arena kini terpasang sebagai PWA Desktop di laptop Anda dan dapat dibuka dari Desktop/Menu Aplikasi kapan saja secara offline.',
      confirmButtonColor: '#dc2626'
    });
  }
}
</script>
