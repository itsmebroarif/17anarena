<template>
  <div>
    <!-- Bottom Navigation Bar for Mobile / Android Viewport -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1.5 py-1 flex items-center justify-around select-none">
      
      <!-- 1. Cabang Lomba -->
      <router-link
        to="/competitions"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/competitions' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="route.path === '/competitions' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-trophy-fill text-base"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5 font-bold">Lomba</span>
        <span v-if="route.path === '/competitions'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 2. Pendaftaran Peserta -->
      <router-link
        to="/registration"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/registration' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="route.path === '/registration' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-person-plus-fill text-base"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5 font-bold">Daftar</span>
        <span v-if="route.path === '/registration'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 3. Panggung Live Arena -->
      <router-link
        to="/waiting-lounge"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/waiting-lounge' || route.path === '/competition-board' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all relative"
          :class="route.path === '/waiting-lounge' || route.path === '/competition-board' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-broadcast text-base"></i>
          <!-- Live Waiting Count Badge -->
          <span
            v-if="store.dashboardStats.waiting > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white font-mono font-black text-[9px] rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse"
          >
            {{ store.dashboardStats.waiting > 99 ? '99+' : store.dashboardStats.waiting }}
          </span>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5 font-bold">Live Arena</span>
        <span v-if="route.path === '/waiting-lounge' || route.path === '/competition-board'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 4. Hall of Fame -->
      <router-link
        to="/hall-of-fame"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/hall-of-fame' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="route.path === '/hall-of-fame' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-stars text-base"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5 font-bold">Hall of Fame</span>
        <span v-if="route.path === '/hall-of-fame'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 5. Panitia (Password Protected: arif_lucu) -->
      <button
        type="button"
        @click="openPanitiaSheet"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="isMenuOpen ? 'text-red-600 font-black' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="isMenuOpen ? 'bg-red-50 text-red-600 shadow-2xs' : (store.isCommitteeUnlocked ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700')"
        >
          <i :class="store.isCommitteeUnlocked ? 'bi bi-unlock-fill text-emerald-600' : 'bi bi-shield-lock-fill text-amber-600'"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5 font-bold">{{ store.isCommitteeUnlocked ? 'Panitia' : 'Panitia 🔒' }}</span>
      </button>

    </nav>

    <!-- Android Slide-Up Bottom Sheet Drawer for Panitia -->
    <div
      v-if="isMenuOpen"
      class="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in"
      @click.self="isMenuOpen = false"
    >
      <div class="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
        
        <!-- Bottom Sheet Drag Handle Bar -->
        <div class="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2"></div>

        <!-- Header Sheet -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              17
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-slate-900">Panel Khusus Panitia</h3>
              <p class="text-[10px] text-emerald-600 font-bold">Terbuka & Terverifikasi (arif_lucu)</p>
            </div>
          </div>
          <button
            @click="isMenuOpen = false"
            class="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <i class="bi bi-x-lg text-xs"></i>
          </button>
        </div>

        <!-- Quick Search & Broadcast Bar -->
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="openSearchModal"
            class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-200"
          >
            <i class="bi bi-search text-red-600"></i>
            <span>Cari Peserta</span>
          </button>

          <button
            @click="openBulkWaModal"
            class="p-2.5 bg-emerald-600 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <i class="bi bi-whatsapp"></i>
            <span>Broadcast WA</span>
          </button>
        </div>

        <!-- Panitia Navigation Grid -->
        <div class="space-y-2 pt-1">
          <h4 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Modul Administrasi Panitia</h4>
          
          <div class="grid grid-cols-3 gap-2.5 text-center text-xs">
            
            <router-link
              v-for="item in committeeMenuItems"
              :key="item.path"
              :to="item.path"
              @click="isMenuOpen = false"
              class="flex flex-col items-center p-2.5 rounded-2xl border transition-all active:scale-95"
              :class="route.path === item.path ? 'bg-red-50 border-red-300 text-red-700 font-extrabold shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'"
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-1.5 shadow-2xs"
                :class="item.bgColor"
              >
                <i :class="item.icon"></i>
              </div>
              <span class="text-[10px] leading-tight font-extrabold">{{ item.title }}</span>
            </router-link>

          </div>
        </div>

        <!-- Lock Button Footer -->
        <div class="pt-2">
          <button
            @click="lockCommitteeAndClose"
            class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <i class="bi bi-lock-fill"></i>
            <span>Kunci Kembali Akses Panitia</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useArenaStore } from '../stores/arenaStore';

const emit = defineEmits(['openSearch', 'openBulkWa']);

const route = useRoute();
const store = useArenaStore();
const isMenuOpen = ref(false);

async function openPanitiaSheet() {
  if (!store.isCommitteeUnlocked) {
    const success = await store.requestCommitteeAccess();
    if (success) {
      isMenuOpen.value = true;
    }
  } else {
    isMenuOpen.value = true;
  }
}

function lockCommitteeAndClose() {
  isMenuOpen.value = false;
  store.lockCommittee();
}

function openSearchModal() {
  isMenuOpen.value = false;
  emit('openSearch');
}

function openBulkWaModal() {
  isMenuOpen.value = false;
  emit('openBulkWa');
}

const committeeMenuItems = [
  { title: 'Penilaian Juri', path: '/scoring', icon: 'bi bi-calculator-fill', bgColor: 'bg-red-100 text-red-700' },
  { title: 'Hasil & Juara', path: '/results', icon: 'bi bi-award-fill', bgColor: 'bg-amber-100 text-amber-800' },
  { title: 'Klasemen Poin', path: '/resulting-point', icon: 'bi bi-bar-chart-line-fill', bgColor: 'bg-blue-100 text-blue-800' },
  { title: 'Sertifikat A4', path: '/certificates', icon: 'bi bi-patch-check-fill', bgColor: 'bg-emerald-100 text-emerald-800' },
  { title: 'Undian Spin', path: '/lucky-spin', icon: 'bi bi-gift-fill', bgColor: 'bg-rose-100 text-rose-800' },
  { title: 'Kartu Panitia', path: '/committee', icon: 'bi bi-person-badge-fill', bgColor: 'bg-purple-100 text-purple-800' },
  { title: 'Keuangan Kas', path: '/money', icon: 'bi bi-wallet2', bgColor: 'bg-emerald-100 text-emerald-800' },
  { title: 'RAB Anggaran', path: '/rab', icon: 'bi bi-calculator', bgColor: 'bg-indigo-100 text-indigo-800' },
  { title: 'Rundown Acara', path: '/rundown', icon: 'bi bi-clock-history', bgColor: 'bg-amber-100 text-amber-800' },
  { title: 'Easy Mode ⚡', path: '/easy-mode', icon: 'bi bi-lightning-charge-fill', bgColor: 'bg-amber-400 text-slate-900 border border-amber-500 font-black' },
  { title: 'Setelan & Data', path: '/settings', icon: 'bi bi-gear-fill', bgColor: 'bg-slate-200 text-slate-800' }
];
</script>
