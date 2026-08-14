<template>
  <div class="a4-printable-document bg-white text-slate-900 font-sans p-8 sm:p-10 max-w-4xl mx-auto shadow-lg border border-slate-200 rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
    <!-- KOP SURAT RESMI -->
    <div class="border-b-4 border-slate-900 pb-3 mb-6 flex items-center justify-between gap-4 border-double">
      <!-- Logo / Symbol Left -->
      <div class="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-sm print:shadow-none">
        🇮🇩
      </div>

      <!-- Kop Center Text -->
      <div class="text-center flex-1 space-y-0.5">
        <h3 class="font-extrabold text-xs tracking-widest text-red-600 uppercase">
          PANITIA PELAKSANA PERINGATAN HUT KEMERDEKAAN RI KE-81
        </h3>
        <h1 class="font-black text-lg sm:text-xl text-slate-900 tracking-wide uppercase">
          RUKUN TETANGGA 05 / RUKUN WARGA 02
        </h1>
        <p class="text-xs font-bold text-slate-700">
          {{ store.settings.eventName || '17an Arena Championship' }} — TAHUN {{ store.settings.eventYear || 2026 }}
        </p>
        <p class="text-[10px] text-slate-500 italic">
          Sekretariat: {{ store.settings.location || 'Lapangan Utama RT 05 / RW 02' }} | Telp/WA: {{ store.settings.mcPhoneNumber || '0812-3456-7890' }}
        </p>
      </div>

      <!-- Right Emblem -->
      <div class="w-16 h-16 rounded-2xl border-2 border-red-600/30 bg-red-50 text-red-700 flex flex-col items-center justify-center shrink-0">
        <span class="font-black text-xs">HUT RI</span>
        <span class="font-black text-lg leading-none">81</span>
      </div>
    </div>

    <!-- DOCUMENT TITLE -->
    <div class="text-center mb-6">
      <h2 class="font-black text-base sm:text-lg text-slate-900 uppercase underline decoration-2 underline-offset-4">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-xs font-bold text-slate-600 mt-1">
        {{ subtitle }}
      </p>
      <p class="text-[10px] text-slate-400 mt-0.5 font-mono">
        Nomor Dokumen: DOC/17AN/{{ docCode }}/{{ new Date().getFullYear() }} | Tanggal Cetak: {{ formattedDate }}
      </p>
    </div>

    <!-- MAIN CONTENT SLOT (TABLES, CARDS, FINANCIAL STATS) -->
    <div class="document-body mb-10 text-xs leading-relaxed">
      <slot />
    </div>

    <!-- PENGESAHAN TANDA TANGAN (PAK RT & KETUA PELAKSANA) -->
    <div class="signature-section mt-12 pt-6 border-t border-slate-200 print:border-slate-400 page-break-inside-avoid">
      <div class="flex items-center justify-between text-xs text-slate-800 font-medium px-4">
        <!-- Pak RT Signature Box -->
        <div class="text-center space-y-1 min-w-[200px]">
          <p class="font-bold text-slate-600 text-[11px]">Mengetahui & Menyetujui,</p>
          <p class="font-black text-slate-900 uppercase text-xs">Ketua RT 05 / RW 02</p>

          <div class="h-20 flex items-center justify-center relative">
            <div class="text-[10px] text-slate-300 italic border border-dashed border-slate-300 rounded px-3 py-1 print:hidden">
              (Tanda Tangan & Cap RT)
            </div>
          </div>

          <p class="font-extrabold text-slate-900 underline text-xs">
            {{ rtName }}
          </p>
          <p class="text-[10px] text-slate-500">NIP/NIK Warga: RT05-RW02-001</p>
        </div>

        <!-- Center Stamp / Date -->
        <div class="text-center text-[10px] text-slate-400 italic space-y-1 hidden sm:block">
          <p class="font-bold text-slate-600">Ditetapkan di {{ store.settings.location || 'Depok' }}</p>
          <p>Pada tanggal: {{ formattedDate }}</p>
          <div class="w-16 h-16 rounded-full border-2 border-red-500/20 mx-auto flex items-center justify-center text-red-400 font-bold text-[9px] uppercase tracking-tighter rotate-12">
            PANITIA 17AN
          </div>
        </div>

        <!-- Ketua Pelaksana Signature Box -->
        <div class="text-center space-y-1 min-w-[200px]">
          <p class="font-bold text-slate-600 text-[11px]">{{ store.settings.location || 'Depok' }}, {{ formattedDate }}</p>
          <p class="font-black text-slate-900 uppercase text-xs">Ketua Pelaksana 17-an</p>

          <div class="h-20 flex items-center justify-center relative">
            <div class="text-[10px] text-slate-300 italic border border-dashed border-slate-300 rounded px-3 py-1 print:hidden">
              (Tanda Tangan Pelaksana)
            </div>
          </div>

          <p class="font-extrabold text-slate-900 underline text-xs">
            {{ headName }}
          </p>
          <p class="text-[10px] text-slate-500">Ketua Pelaksana HUT RI KE-81</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

const props = defineProps<{
  title: string;
  subtitle?: string;
  docCode?: string;
}>();

const store = useArenaStore();

const docCode = computed(() => props.docCode || 'RPT');

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const rtName = computed(() => {
  const foundRt = store.committees.find(c => c.role.toLowerCase().includes('rt') || c.name.toLowerCase().includes('rt'));
  if (foundRt) return foundRt.name;
  return 'Pak Bambang (Ketua RT 05)';
});

const headName = computed(() => {
  if (store.settings.headOfCommittee && store.settings.headOfCommittee.trim()) {
    return store.settings.headOfCommittee;
  }
  const foundHead = store.committees.find(c => c.role.toLowerCase().includes('ketua') || c.role.toLowerCase().includes('pelaksana'));
  if (foundHead) return foundHead.name;
  return 'Arif Permana (Ketua Pelaksana)';
});
</script>

<style scoped>
@media print {
  .a4-printable-document {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
