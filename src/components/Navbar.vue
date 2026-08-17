<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 px-3 sm:px-6 flex items-center justify-between shadow-2xs">
    <!-- Left: Mobile Toggle, Brand & Location -->
    <div class="flex items-center space-x-3">
      <button
        @click="$emit('toggleSidebar')"
        class="lg:hidden p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
        title="Toggle Navigation Menu"
      >
        <i class="bi bi-list text-2xl"></i>
      </button>

      <router-link to="/" class="flex items-center gap-2.5 group">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-rose-900 border-2 border-amber-400 flex items-center justify-center shadow-sm text-amber-300 font-black text-base tracking-tighter">
          17
        </div>
        <div>
          <h2 class="text-xs sm:text-sm font-black text-slate-900 leading-tight tracking-tight uppercase group-hover:text-red-600 transition-colors">
            17AN ARENA
          </h2>
          <span class="hidden sm:inline-flex px-1.5 py-0.2 bg-red-50 text-red-700 text-[9px] font-extrabold rounded-full uppercase tracking-wider items-center gap-1 border border-red-200">
            <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>{{ store.settings.location || 'Bojong Lio' }}</span>
          </span>
        </div>
      </router-link>
    </div>

    <!-- Center: Main Public Menu (Cabang Lomba, Pendaftaran, Live Arena, Hall of Fame) -->
    <nav class="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
      <!-- 1. Cabang Perlombaan -->
      <router-link
        to="/competitions"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
        :class="[
          $route.path === '/competitions'
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
        ]"
      >
        <i class="bi bi-trophy-fill text-amber-400" :class="$route.path === '/competitions' ? 'text-amber-300' : 'text-red-600'"></i>
        <span>Cabang Lomba</span>
      </router-link>

      <!-- 2. Pendaftaran Peserta -->
      <router-link
        to="/registration"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
        :class="[
          $route.path === '/registration'
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
        ]"
      >
        <i class="bi bi-person-plus-fill" :class="$route.path === '/registration' ? 'text-white' : 'text-blue-600'"></i>
        <span>Pendaftaran Peserta</span>
      </router-link>

      <!-- 3. Panggung Live Arena -->
      <router-link
        to="/waiting-lounge"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all relative"
        :class="[
          $route.path === '/waiting-lounge' || $route.path === '/competition-board'
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
        ]"
      >
        <i class="bi bi-broadcast" :class="$route.path === '/waiting-lounge' ? 'text-white' : 'text-amber-500'"></i>
        <span>Panggung Live Arena</span>
        <span
          v-if="store.dashboardStats.waiting > 0"
          class="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-amber-400 text-slate-900 border border-amber-500 animate-pulse"
        >
          {{ store.dashboardStats.waiting }}
        </span>
      </router-link>

      <!-- 4. Hall of Fame -->
      <router-link
        to="/hall-of-fame"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
        :class="[
          $route.path === '/hall-of-fame'
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
        ]"
      >
        <i class="bi bi-stars" :class="$route.path === '/hall-of-fame' ? 'text-white' : 'text-purple-600'"></i>
        <span>Hall of Fame</span>
      </router-link>

      <!-- 5. Cetak Sertifikat (Bisa diakses Publik & User) -->
      <router-link
        to="/certificates"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
        :class="[
          $route.path === '/certificates'
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
        ]"
      >
        <i class="bi bi-patch-check-fill" :class="$route.path === '/certificates' ? 'text-white' : 'text-emerald-600'"></i>
        <span>Cetak Sertifikat</span>
      </router-link>

      <!-- 6. Susunan Panitia -->
      <router-link
        to="/committee"
        class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
        :class="[
          $route.path === '/committee'
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
        ]"
      >
        <i class="bi bi-people-fill" :class="$route.path === '/committee' ? 'text-white' : 'text-indigo-600'"></i>
        <span>Susunan Panitia</span>
      </router-link>
    </nav>

    <!-- Right: Panitia Dropdown & Utility Buttons -->
    <div class="flex items-center space-x-2">
      <!-- PANITIA DROPDOWN (PASSWORD PROTECTED: arif_lucu) -->
      <div class="relative" v-click-outside="closeCommitteeDropdown">
        <button
          @click="toggleCommitteeDropdown"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all active:scale-95 border shadow-xs"
          :class="[
            store.isCommitteeUnlocked
              ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-700 hover:from-red-700 hover:to-rose-800'
              : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
          ]"
          :title="store.isCommitteeUnlocked ? 'Menu Panitia (Akses Terbuka)' : 'Buka Kunci Menu Panitia (Password: arif_lucu)'"
        >
          <i :class="store.isCommitteeUnlocked ? 'bi bi-unlock-fill text-emerald-300' : 'bi bi-shield-lock-fill text-amber-400'"></i>
          <span class="hidden xs:inline">Panitia</span>
          <span
            v-if="!store.isCommitteeUnlocked"
            class="px-1.5 py-0.2 text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded uppercase"
          >
            Lock
          </span>
          <i class="bi bi-chevron-down text-[10px] ml-0.5" :class="{ 'rotate-180': isCommitteeOpen }"></i>
        </button>

        <!-- Dropdown Menu Panitia -->
        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
          <div
            v-if="isCommitteeOpen"
            class="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
          >
            <!-- Dropdown Header -->
            <div class="p-3.5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border-b border-slate-700 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 text-sm">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-xs text-white">Panel Administrasi Panitia</h4>
                  <p class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Status: Terverifikasi (arif_lucu)</span>
                  </p>
                </div>
              </div>
              <button
                @click="lockCommitteeAndClose"
                class="p-1.5 text-rose-300 hover:text-white hover:bg-rose-600/30 rounded-lg text-xs"
                title="Kunci Kembali Akses Panitia"
              >
                <i class="bi bi-lock-fill"></i>
              </button>
            </div>

            <!-- Dropdown Links Grid -->
            <div class="p-2 space-y-1 max-h-[70vh] overflow-y-auto">
              <div class="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Operasional Lomba & Juri
              </div>

              <router-link
                to="/scoring"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <i class="bi bi-calculator-fill text-red-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Penilaian Juri (Scoring)</div>
                  <div class="text-[10px] text-slate-400 font-normal">Input skor & rekap babak penyisihan/final</div>
                </div>
              </router-link>

              <router-link
                to="/results"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <i class="bi bi-award-fill text-amber-500 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Hasil & Juara Lomba</div>
                  <div class="text-[10px] text-slate-400 font-normal">Penetapan Juara 1, 2, 3 per cabang</div>
                </div>
              </router-link>

              <router-link
                to="/resulting-point"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <i class="bi bi-bar-chart-line-fill text-blue-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Klasemen Resulting Point</div>
                  <div class="text-[10px] text-slate-400 font-normal">Poin akumulatif peserta & juara umum</div>
                </div>
              </router-link>

              <router-link
                to="/certificates"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <i class="bi bi-patch-check-fill text-emerald-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Cetak Sertifikat Juara (A4)</div>
                  <div class="text-[10px] text-slate-400 font-normal">Sertifikat resmi cetak A4 & tanda tangan</div>
                </div>
              </router-link>

              <router-link
                to="/lucky-spin"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <i class="bi bi-arrow-clockwise text-rose-500 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Lucky Spin Doorprize</div>
                  <div class="text-[10px] text-slate-400 font-normal">Roda putar undian nomor kupon warga</div>
                </div>
              </router-link>

              <div class="my-1.5 border-t border-slate-100"></div>

              <div class="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Dokumen & Keuangan Panitia (A4)
              </div>

              <router-link
                to="/committee"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <i class="bi bi-person-badge-fill text-purple-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Panitia & ID Card A4</div>
                  <div class="text-[10px] text-slate-400 font-normal">12 anggota panitia & cetak lanyard</div>
                </div>
              </router-link>

              <router-link
                to="/money"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <i class="bi bi-wallet2 text-emerald-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Keuangan Kas Panitia (A4)</div>
                  <div class="text-[10px] text-slate-400 font-normal">Pemasukan, pengeluaran & saldo net</div>
                </div>
              </router-link>

              <router-link
                to="/rab"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <i class="bi bi-calculator text-indigo-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">RAB Anggaran (A4)</div>
                  <div class="text-[10px] text-slate-400 font-normal">Rencana anggaran & rincian barang 2026</div>
                </div>
              </router-link>

              <router-link
                to="/rundown"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <i class="bi bi-clock-history text-amber-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Rundown Acara (A4)</div>
                  <div class="text-[10px] text-slate-400 font-normal">21 susunan acara 17 Agustus 2026</div>
                </div>
              </router-link>

              <div class="my-1.5 border-t border-slate-100"></div>

              <div class="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Alat & Setelan Sistem
              </div>

              <router-link
                to="/easy-mode"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <i class="bi bi-lightning-charge-fill text-amber-500 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold text-amber-700">Mode Lapangan (Easy Mode)</div>
                  <div class="text-[10px] text-slate-400 font-normal">Antarmuka tombol besar untuk HP panitia</div>
                </div>
              </router-link>

              <router-link
                to="/settings"
                @click="isCommitteeOpen = false"
                class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <i class="bi bi-gear-fill text-slate-600 w-4 text-center"></i>
                <div class="flex-1">
                  <div class="font-bold">Pengaturan & Backup Data</div>
                  <div class="text-[10px] text-slate-400 font-normal">Setelan tema, lokasi, backup/import JSON</div>
                </div>
              </router-link>
            </div>

            <!-- Dropdown Footer Action: Lock -->
            <div class="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                @click="lockCommitteeAndClose"
                class="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-rose-200"
              >
                <i class="bi bi-lock-fill"></i>
                <span>Kunci Akses Panitia</span>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Bulk WA Broadcast Button -->
      <button
        @click="$emit('openBulkWa')"
        class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
        title="Broadcast WA Masal Ke Peserta"
      >
        <i class="bi bi-whatsapp"></i>
        <span class="hidden lg:inline">Broadcast WA</span>
      </button>

      <!-- Search Button -->
      <button
        @click="$emit('openSearch')"
        class="flex items-center space-x-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
        title="Cari Peserta (Tekan /)"
      >
        <i class="bi bi-search text-slate-500"></i>
        <span class="hidden md:inline">Cari...</span>
        <kbd class="hidden xl:inline-block px-1 py-0.2 text-[9px] font-mono bg-white border border-slate-300 rounded text-slate-500">
          /
        </kbd>
      </button>

      <!-- Dark Mode Toggle Button -->
      <button
        @click="store.toggleDarkMode()"
        class="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 text-xs"
        :title="store.isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'"
      >
        <i :class="store.isDarkMode ? 'bi bi-sun-fill text-amber-500' : 'bi bi-moon-stars-fill text-indigo-600'"></i>
      </button>

      <!-- PWA Install Button -->
      <button
        v-if="canInstall && !isPwaInstalled"
        @click="installPwa"
        class="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-transform active:scale-95 border border-amber-500"
        title="Install Aplikasi PWA"
      >
        <i class="bi bi-download"></i>
        <span class="hidden md:inline">Install</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { deferredInstallPrompt, isPwaInstalled, promptInstallPwa } from '../services/pwa';

const store = useArenaStore();
const isCommitteeOpen = ref(false);

const canInstall = computed(() => !!deferredInstallPrompt.value);

async function installPwa() {
  await promptInstallPwa();
}

async function toggleCommitteeDropdown() {
  if (!store.isCommitteeUnlocked) {
    const success = await store.requestCommitteeAccess();
    if (success) {
      isCommitteeOpen.value = true;
    }
  } else {
    isCommitteeOpen.value = !isCommitteeOpen.value;
  }
}

function closeCommitteeDropdown() {
  isCommitteeOpen.value = false;
}

function lockCommitteeAndClose() {
  isCommitteeOpen.value = false;
  store.lockCommittee();
}

// Simple custom click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el._clickOutside);
  }
};

defineEmits(['toggleSidebar', 'openSearch', 'openBulkWa', 'openSqlConsole', 'openShortcuts']);
</script>
