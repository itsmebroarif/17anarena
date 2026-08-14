<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
    <!-- Left: Mobile Toggle & Header Title / Location -->
    <div class="flex items-center space-x-3">
      <button
        @click="$emit('toggleSidebar')"
        class="lg:hidden p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
        title="Toggle Navigation Menu"
      >
        <i class="bi bi-list text-2xl"></i>
      </button>

      <div class="flex items-center gap-2.5">
        <h2 class="text-sm sm:text-base font-black text-slate-900 leading-tight tracking-tight uppercase">
          17AN ARENA
        </h2>
        <span class="hidden md:inline-flex px-2.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider items-center gap-1 border border-red-200">
          <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          <span>{{ store.settings.location || 'Lokasi Arena' }}</span>
        </span>
      </div>
    </div>

    <!-- Right: Streamlined Action Buttons -->
    <div class="flex items-center space-x-2">
      <!-- Easy Mode Quick Button -->
      <router-link
        to="/easy-mode"
        class="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-transform active:scale-95 border border-amber-500 shadow-2xs"
        title="Mode Lapangan Ringkas (Easy Mode)"
      >
        <i class="bi bi-lightning-charge-fill text-red-600"></i>
        <span class="hidden xs:inline">Easy Mode</span>
      </router-link>

      <!-- Search Button -->
      <button
        @click="$emit('openSearch')"
        class="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
        :title="t('header.searchPlaceholder', 'Cari Peserta')"
      >
        <i class="bi bi-search text-slate-500"></i>
        <span class="hidden sm:inline">{{ t('common.search', 'Cari Peserta...') }}</span>
        <kbd class="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-500">
          /
        </kbd>
      </button>

      <!-- Bulk WA Broadcast Button -->
      <button
        @click="$emit('openBulkWa')"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
        title="Broadcast WA Masal Ke Peserta"
      >
        <i class="bi bi-whatsapp"></i>
        <span class="hidden sm:inline">{{ t('header.broadcastWa', 'Broadcast WA') }}</span>
      </button>

      <span class="h-5 w-px bg-slate-200 mx-1"></span>

      <!-- Online / Offline Badge -->
      <span
        class="px-2 py-1 text-[10px] font-black rounded-lg flex items-center gap-1 border"
        :class="isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-900 text-amber-300 border-amber-500/50'"
        :title="isOnline ? 'Terhubung ke Jaringan (Online)' : 'Mode Offline Standalone'"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="isOnline ? 'bg-emerald-500' : 'bg-amber-400 animate-ping'"></span>
        <span class="hidden lg:inline">{{ isOnline ? t('header.online', 'Online') : t('header.offline', 'Offline') }}</span>
      </span>

      <!-- Dark Mode Toggle Button -->
      <button
        @click="store.toggleDarkMode()"
        class="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 text-xs"
        :title="store.isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'"
      >
        <i :class="store.isDarkMode ? 'bi bi-sun-fill text-amber-500' : 'bi bi-moon-stars-fill text-indigo-600'"></i>
      </button>

      <!-- Keyboard Shortcuts -->
      <button
        @click="$emit('openShortcuts')"
        class="hidden sm:flex p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 text-xs"
        :title="t('header.shortcuts', 'Pintasan Keyboard')"
      >
        <i class="bi bi-keyboard text-slate-700"></i>
      </button>

      <!-- PWA Install Button -->
      <button
        v-if="canInstall && !isPwaInstalled"
        @click="installPwa"
        class="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-transform active:scale-95 border border-amber-500"
        title="Install Aplikasi"
      >
        <i class="bi bi-download"></i>
        <span class="hidden md:inline">Install</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { isOnline, deferredInstallPrompt, isPwaInstalled, promptInstallPwa } from '../services/pwa';
import { t } from '../services/i18n';

const store = useArenaStore();

const canInstall = computed(() => !!deferredInstallPrompt.value);

async function installPwa() {
  await promptInstallPwa();
}

defineEmits(['toggleSidebar', 'openSearch', 'openBulkWa', 'openSqlConsole', 'openShortcuts']);
</script>
