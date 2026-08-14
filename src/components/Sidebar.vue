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
        'fixed lg:sticky top-0 lg:top-20 inset-y-0 left-0 z-40 lg:z-20 w-64 h-screen lg:h-[calc(100vh-5rem)] bg-white text-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between border-r border-slate-200 shadow-xl lg:shadow-none flex-shrink-0 transition-colors',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Navigation Menu Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-rose-900 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-red-500/20 text-amber-300 font-black text-xl tracking-tighter relative overflow-hidden group">
            <span class="absolute top-0 left-0 right-0 h-1/2 bg-red-500/40"></span>
            <span class="relative z-10 font-black drop-shadow-md">17</span>
          </div>
          <div>
            <h1 class="font-black text-slate-900 leading-tight text-sm tracking-tight flex items-center gap-1">
              <span>17AN ARENA</span>
            </h1>
            <p class="text-[10px] text-red-600 uppercase tracking-widest font-extrabold">CHAMPIONSHIP ALL-IN-ONE</p>
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
    <nav class="flex-1 p-3 space-y-2 overflow-y-auto">
      <div v-for="(group, gIdx) in navGroups" :key="group.title">
        <!-- Horizontal Ruler before sections (except first) -->
        <div v-if="gIdx > 0" class="my-3 border-t border-slate-200"></div>

        <!-- Section Header Title -->
        <div class="px-3 py-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" :class="group.dotClass || 'bg-red-500'"></span>
            {{ group.title }}
          </span>
          <span
            v-if="group.badge"
            class="px-1.5 py-0.5 rounded text-[9px] font-extrabold"
            :class="group.badgeClass || 'bg-slate-100 text-slate-600'"
          >
            {{ group.badge }}
          </span>
        </div>

        <!-- Group Items -->
        <div class="space-y-1 mt-1">
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group"
            :class="[
              $route.path === item.path
                ? 'bg-red-600 text-white shadow-sm shadow-red-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i :class="[item.icon, 'text-sm group-hover:scale-110 transition-transform', $route.path === item.path ? 'text-white' : 'text-slate-500']"></i>
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="item.badge !== undefined && item.badge !== null && item.badge !== ''"
              class="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0"
              :class="[
                $route.path === item.path
                  ? 'bg-white/20 text-white'
                  : (item.badgeClass || 'bg-slate-100 text-slate-600')
              ]"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Footer System Status Card -->
    <div class="p-4 border-t border-slate-200">
      <div class="bg-slate-100 text-slate-800 p-4 rounded-xl space-y-2 border border-slate-200">
        <div class="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500">
          <span>Offline Mode</span>
          <span class="text-emerald-600 font-extrabold">Active</span>
        </div>
        <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div class="h-full w-full bg-emerald-500"></div>
        </div>
        <p class="text-[11px] font-medium text-slate-600 flex items-center justify-between">
          <span>Local Sync Ready</span>
          <span class="font-mono text-[10px] text-slate-400">v1.0</span>
        </p>
      </div>
    </div>
  </aside>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { t } from '../services/i18n';

defineProps<{ isOpen: boolean }>();
defineEmits(['close']);

const store = useArenaStore();

const navGroups = computed(() => [
  {
    title: 'UTAMA & PANDUAN',
    dotClass: 'bg-slate-400',
    items: [
      { path: '/', label: t('nav.dashboard', 'Dashboard Utama'), icon: 'bi bi-grid-1x2-fill' },
      { path: '/easy-mode', label: 'Mode Lapangan (Easy Mode)', icon: 'bi bi-lightning-charge-fill', badge: 'EASY', badgeClass: 'bg-amber-400 text-slate-900 font-black animate-pulse border border-amber-500' },
      { path: '/tutorial', label: t('nav.tutorial', 'Tutorial & Panduan'), icon: 'bi bi-book-half', badge: 'GUIDE', badgeClass: 'bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200' }
    ]
  },
  {
    title: 'KHUSUS LOMBA',
    badge: 'ARENA',
    badgeClass: 'bg-red-100 text-red-700 border border-red-200',
    dotClass: 'bg-red-600',
    items: [
      { path: '/competitions', label: t('nav.competitions', 'Daftar Cabang Lomba'), icon: 'bi bi-trophy-fill', badge: store.competitions.length },
      { path: '/registration', label: t('nav.registration', 'Registrasi Peserta'), icon: 'bi bi-person-plus-fill' },
      { path: '/waiting-lounge', label: t('nav.liveArena', 'Waiting Lounge Live'), icon: 'bi bi-hourglass-split', badge: store.dashboardStats.waiting, badgeClass: 'bg-amber-100 text-amber-800 font-bold border border-amber-200' },
      { path: '/scoring', label: t('nav.scoring', 'Penilaian Juri (Scoring)'), icon: 'bi bi-calculator-fill' },
      { path: '/results', label: t('common.details', 'Hasil & Juara Lomba'), icon: 'bi bi-award-fill' },
      { path: '/resulting-point', label: 'Klasemen Resulting Point', icon: 'bi bi-bar-chart-line-fill' },
      { path: '/hall-of-fame', label: 'Hall of Fame / Podia', icon: 'bi bi-stars' },
      { path: '/certificates', label: t('nav.certificates', 'Cetak Sertifikat Juara'), icon: 'bi bi-patch-check-fill' },
      { path: '/lucky-spin', label: t('nav.doorprize', 'Lucky Spin Doorprize'), icon: 'bi bi-arrow-clockwise' }
    ]
  },
  {
    title: 'ADMINISTRATIF PANITIA',
    badge: 'DOKUMEN A4',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
    dotClass: 'bg-blue-600',
    items: [
      { path: '/committee', label: t('nav.committee', 'Panitia & ID Card'), icon: 'bi bi-person-badge-fill', badge: store.committees.length, badgeClass: 'bg-red-100 text-red-700' },
      { path: '/money', label: 'Keuangan Kas (A4)', icon: 'bi bi-wallet2', badge: 'PDF', badgeClass: 'bg-emerald-100 text-emerald-800 font-extrabold' },
      { path: '/rab', label: 'RAB Anggaran (A4)', icon: 'bi bi-calculator', badge: 'PDF', badgeClass: 'bg-indigo-100 text-indigo-800 font-extrabold' },
      { path: '/rundown', label: 'Rundown Acara (A4)', icon: 'bi bi-clock-history', badge: 'PDF', badgeClass: 'bg-amber-100 text-amber-800 font-extrabold' }
    ]
  },
  {
    title: 'SISTEM & UTILITAS',
    dotClass: 'bg-purple-600',
    items: [
      { path: '/superuser', label: 'Super User Studio', icon: 'bi bi-database-fill-gear', badge: 'SQL', badgeClass: 'bg-purple-100 text-purple-700 font-extrabold border border-purple-200' },
      { path: '/import-export', label: t('common.export', 'Import / Export Data'), icon: 'bi bi-arrow-down-up' },
      { path: '/settings', label: t('nav.settings', 'Pengaturan Acara'), icon: 'bi bi-gear-fill' }
    ]
  }
]);
</script>
