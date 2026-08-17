<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden transition-opacity"
    ></div>

    <aside
      :class="[
        'fixed lg:sticky top-0 lg:top-16 inset-y-0 left-0 z-40 lg:z-20 w-64 h-screen lg:h-[calc(100vh-4rem)] bg-white text-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between border-r border-slate-200 shadow-xl lg:shadow-none flex-shrink-0 transition-colors',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Navigation Menu Header -->
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-rose-900 border-2 border-amber-400 flex items-center justify-center shadow-md text-amber-300 font-black text-lg tracking-tighter">
            17
          </div>
          <div>
            <h1 class="font-black text-slate-900 leading-tight text-sm tracking-tight">
              17AN ARENA
            </h1>
            <p class="text-[10px] text-red-600 uppercase tracking-widest font-extrabold">{{ store.settings.location || 'Bojong Lio 2026' }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

    <!-- Nav Links List -->
    <nav class="flex-1 p-3 space-y-4 overflow-y-auto">
      <!-- 1. Section: TAMPILAN UTAMA & PUBLIK -->
      <div>
        <div class="px-3 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            TAMPILAN PUBLIK
          </span>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-red-50 text-red-700 border border-red-200">
            UTAMA
          </span>
        </div>

        <div class="space-y-1 mt-1.5">
          <!-- Cabang Perlombaan -->
          <router-link
            to="/competitions"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/competitions'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i class="bi bi-trophy-fill text-sm" :class="$route.path === '/competitions' ? 'text-white' : 'text-amber-500'"></i>
            <span class="truncate">Cabang Perlombaan</span>
            <span
              class="ml-auto px-2 py-0.5 text-[10px] font-extrabold rounded-full"
              :class="$route.path === '/competitions' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'"
            >
              {{ store.competitions.length }}
            </span>
          </router-link>

          <!-- Pendaftaran Peserta -->
          <router-link
            to="/registration"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/registration'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i class="bi bi-person-plus-fill text-sm" :class="$route.path === '/registration' ? 'text-white' : 'text-blue-600'"></i>
            <span class="truncate">Pendaftaran Peserta</span>
            <span
              v-if="store.participants.length > 0"
              class="ml-auto px-2 py-0.5 text-[10px] font-extrabold rounded-full"
              :class="$route.path === '/registration' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'"
            >
              {{ store.participants.length }}
            </span>
          </router-link>

          <!-- Panggung Live Arena -->
          <router-link
            to="/waiting-lounge"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/waiting-lounge' || $route.path === '/competition-board'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i class="bi bi-broadcast text-sm" :class="$route.path === '/waiting-lounge' ? 'text-white' : 'text-amber-500'"></i>
            <span class="truncate">Panggung Live Arena</span>
            <span
              v-if="store.dashboardStats.waiting > 0"
              class="ml-auto px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-400 text-slate-900 animate-pulse"
            >
              {{ store.dashboardStats.waiting }}
            </span>
          </router-link>

          <!-- Hall of Fame -->
          <router-link
            to="/hall-of-fame"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/hall-of-fame'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i class="bi bi-stars text-sm" :class="$route.path === '/hall-of-fame' ? 'text-white' : 'text-purple-600'"></i>
            <span class="truncate">Hall of Fame</span>
          </router-link>

          <!-- Cetak Sertifikat (Publik) -->
          <router-link
            to="/certificates"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/certificates'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i class="bi bi-patch-check-fill text-sm" :class="$route.path === '/certificates' ? 'text-white' : 'text-emerald-600'"></i>
            <span class="truncate">Cetak Sertifikat</span>
          </router-link>

          <!-- Susunan Panitia (Publik) -->
          <router-link
            to="/committee"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/committee'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i class="bi bi-people-fill text-sm" :class="$route.path === '/committee' ? 'text-white' : 'text-indigo-600'"></i>
            <span class="truncate">Susunan Panitia</span>
            <span
              class="ml-auto px-2 py-0.5 text-[10px] font-extrabold rounded-full"
              :class="$route.path === '/committee' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'"
            >
              {{ store.committees.length }}
            </span>
          </router-link>

          <!-- Beranda Dashboard -->
          <router-link
            to="/"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            :class="[
              $route.path === '/'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            ]"
          >
            <i class="bi bi-grid-1x2-fill text-sm"></i>
            <span class="truncate">Dashboard Utama</span>
          </router-link>
        </div>
      </div>

      <!-- 2. Section: MENU PANITIA (Password Protected: arif_lucu) -->
      <div class="border-t border-slate-200 pt-3">
        <div class="px-3 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" :class="store.isCommitteeUnlocked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
            MENU PANITIA
          </span>
          <button
            @click="toggleUnlock"
            class="px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
            :class="store.isCommitteeUnlocked ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-900 text-amber-300'"
          >
            <i :class="store.isCommitteeUnlocked ? 'bi bi-unlock-fill' : 'bi bi-lock-fill'"></i>
            <span>{{ store.isCommitteeUnlocked ? 'Unlocked' : 'Sandi' }}</span>
          </button>
        </div>

        <!-- If Committee Locked: Show Prompt Card -->
        <div v-if="!store.isCommitteeUnlocked" class="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
          <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mx-auto text-sm">
            <i class="bi bi-shield-lock-fill text-amber-600"></i>
          </div>
          <p class="text-[11px] font-bold text-slate-700 leading-tight">
            Menu Panitia Terkunci
          </p>
          <p class="text-[10px] text-slate-500">
            Penilaian, sertifikat, kas, RAB & rundown memerlukan kata sandi panitia.
          </p>
          <button
            @click="store.requestCommitteeAccess()"
            class="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <i class="bi bi-key-fill"></i>
            <span>Buka Akses (arif_lucu)</span>
          </button>
        </div>

        <!-- If Committee Unlocked: Show Full Administrative List -->
        <div v-else class="space-y-1 mt-1.5">
          <router-link
            v-for="item in committeeItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            :class="[
              $route.path === item.path
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i :class="[item.icon, 'text-xs', $route.path === item.path ? 'text-white' : item.color]"></i>
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto px-1.5 py-0.2 text-[9px] font-extrabold rounded"
              :class="$route.path === item.path ? 'bg-white/20 text-white' : item.badgeClass"
            >
              {{ item.badge }}
            </span>
          </router-link>

          <button
            @click="store.lockCommittee()"
            class="w-full mt-2 py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-rose-200"
          >
            <i class="bi bi-lock-fill"></i>
            <span>Kunci Menu Panitia</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Footer System Status Card -->
    <div class="p-3 border-t border-slate-200">
      <div class="bg-slate-50 text-slate-800 p-3 rounded-xl space-y-1.5 border border-slate-200">
        <div class="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500">
          <span>Sistem Offline</span>
          <span class="text-emerald-600 font-extrabold">Aktif 100%</span>
        </div>
        <p class="text-[10px] text-slate-500 flex items-center justify-between">
          <span>Penyimpanan Lokal</span>
          <span class="font-mono text-slate-600 font-bold">Bojong Lio</span>
        </p>
      </div>
    </div>
  </aside>
</div>
</template>

<script setup lang="ts">
import { useArenaStore } from '../stores/arenaStore';

defineProps<{ isOpen: boolean }>();
defineEmits(['close']);

const store = useArenaStore();

function toggleUnlock() {
  if (store.isCommitteeUnlocked) {
    store.lockCommittee();
  } else {
    store.requestCommitteeAccess();
  }
}

const committeeItems = [
  { path: '/scoring', label: 'Penilaian Juri', icon: 'bi bi-calculator-fill', color: 'text-red-600' },
  { path: '/results', label: 'Hasil & Juara Lomba', icon: 'bi bi-award-fill', color: 'text-amber-500' },
  { path: '/resulting-point', label: 'Klasemen Resulting Point', icon: 'bi bi-bar-chart-line-fill', color: 'text-blue-600' },
  { path: '/certificates', label: 'Cetak Sertifikat Juara (A4)', icon: 'bi bi-patch-check-fill', color: 'text-emerald-600', badge: 'A4', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { path: '/lucky-spin', label: 'Lucky Spin Doorprize', icon: 'bi bi-arrow-clockwise', color: 'text-rose-500' },
  { path: '/committee', label: 'Panitia & ID Card (A4)', icon: 'bi bi-person-badge-fill', color: 'text-purple-600', badge: '12', badgeClass: 'bg-purple-100 text-purple-800' },
  { path: '/money', label: 'Keuangan Kas (A4)', icon: 'bi bi-wallet2', color: 'text-emerald-600', badge: 'Kas', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { path: '/rab', label: 'RAB Anggaran (A4)', icon: 'bi bi-calculator', color: 'text-indigo-600', badge: 'RAB', badgeClass: 'bg-indigo-100 text-indigo-800' },
  { path: '/rundown', label: 'Rundown Acara (A4)', icon: 'bi bi-clock-history', color: 'text-amber-600', badge: '21', badgeClass: 'bg-amber-100 text-amber-800' },
  { path: '/easy-mode', label: 'Mode Lapangan (Easy)', icon: 'bi bi-lightning-charge-fill', color: 'text-amber-500', badge: 'EASY', badgeClass: 'bg-amber-400 text-slate-900 font-black' },
  { path: '/settings', label: 'Pengaturan & Backup Data', icon: 'bi bi-gear-fill', color: 'text-slate-600' }
];
</script>
