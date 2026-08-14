<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-award-fill text-amber-500"></i>
          <span>Hasil Pertandingan & Ekspor Data</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Rekapitulasi lengkap peringkat juara dan ekspor ke format SQL, JSON, XLSX, CSV.</p>
      </div>

      <!-- Action & Export Buttons -->
      <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          @click="isPrintPreviewOpen = true"
          class="col-span-2 sm:col-span-1 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-printer-fill"></i>
          <span>Print Preview</span>
        </button>

        <button
          @click="exportXLSXReport"
          class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-file-earmark-excel-fill"></i>
          <span>XLSX</span>
        </button>

        <button
          @click="exportCSVReport"
          class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-filetype-csv"></i>
          <span>CSV</span>
        </button>

        <button
          @click="exportSQLReport"
          class="col-span-2 sm:col-span-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-database-fill-down"></i>
          <span>Ekspor SQL</span>
        </button>
      </div>
    </div>

    <!-- Competition Results Accordion List -->
    <div class="space-y-4">
      <div
        v-for="comp in store.competitions"
        :key="comp.id"
        class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
      >
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
              {{ comp.prefix }}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-1.5">
                <h2 class="font-bold text-slate-900 text-base">{{ comp.name }}</h2>
                <span class="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  {{ comp.category }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                Poin Juara 1: {{ comp.pointFirst }} | Juara 2: {{ comp.pointSecond }} | Juara 3: {{ comp.pointThird }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2 self-start sm:self-auto">
            <button
              v-if="hasWinner(comp.id)"
              @click="sendWinnersToMc(comp)"
              class="px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-2xs"
              title="Kirim pengumuman juara lomba ini ke WhatsApp MC"
            >
              <i class="bi bi-whatsapp"></i>
              <span>WA Ke MC</span>
            </button>

            <button
              v-if="hasWinner(comp.id)"
              @click="confirmDeleteWinner(comp.id)"
              class="px-2.5 py-1 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 shadow-2xs"
              title="Reset / Hapus Penetapan Juara Cabang Lomba Ini"
            >
              <i class="bi bi-trash-fill"></i>
              <span>Reset Juara</span>
            </button>

            <span
              class="px-2.5 py-1 text-xs font-bold rounded-full"
              :class="comp.status === 'Finished' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
            >
              {{ comp.status === 'Finished' ? 'Lomba Selesai' : 'Sedang/Belum Selesai' }}
            </span>
          </div>
        </div>

        <!-- Winner Podium Row -->
        <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
          <!-- Juara 1 -->
          <div class="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl flex items-center space-x-3 shadow-2xs">
            <div class="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 font-black text-xl flex items-center justify-center shadow-xs">
              🥇
            </div>
            <div>
              <span class="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">JUARA 1 ({{ comp.pointFirst }} POIN)</span>
              <h3 class="font-extrabold text-slate-900 text-sm">
                {{ getWinnerName(comp.id, 1) }}
              </h3>
            </div>
          </div>

          <!-- Juara 2 -->
          <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl flex items-center space-x-3 shadow-2xs">
            <div class="w-12 h-12 rounded-2xl bg-slate-300 text-slate-900 font-black text-xl flex items-center justify-center shadow-xs">
              🥈
            </div>
            <div>
              <span class="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">JUARA 2 ({{ comp.pointSecond }} POIN)</span>
              <h3 class="font-extrabold text-slate-900 text-sm">
                {{ getWinnerName(comp.id, 2) }}
              </h3>
            </div>
          </div>

          <!-- Juara 3 -->
          <div class="p-4 bg-amber-900/10 border-2 border-amber-800/30 rounded-2xl flex items-center space-x-3 shadow-2xs">
            <div class="w-12 h-12 rounded-2xl bg-amber-800 text-amber-100 font-black text-xl flex items-center justify-center shadow-xs">
              🥉
            </div>
            <div>
              <span class="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">JUARA 3 ({{ comp.pointThird }} POIN)</span>
              <h3 class="font-extrabold text-slate-900 text-sm">
                {{ getWinnerName(comp.id, 3) }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Preview Overlay Modal -->
    <PrintPreviewModal
      :isOpen="isPrintPreviewOpen"
      title="Rekapitulasi Hasil Lomba & Juara"
      subtitle="Daftar Pemenang Resmi Seluruh Cabang Lomba 17an"
      :columns="resultsPrintColumns"
      :rows="resultsPrintRows"
      @close="isPrintPreviewOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { exportToXLSX, exportToCSV, exportToSQL } from '../services/export';
import { generateMcMessage } from '../services/whatsapp';
import PrintPreviewModal from '../components/PrintPreviewModal.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const isPrintPreviewOpen = ref(false);

const resultsPrintColumns = ref([
  { key: 'index', label: 'No.', visible: true },
  { key: 'competitionName', label: 'Cabang Lomba', visible: true },
  { key: 'category', label: 'Kategori', visible: true },
  { key: 'juara1', label: '🥇 Juara 1', visible: true },
  { key: 'juara2', label: '🥈 Juara 2', visible: true },
  { key: 'juara3', label: '🥉 Juara 3', visible: true },
  { key: 'status', label: 'Status Lomba', visible: true }
]);

const resultsPrintRows = computed(() => {
  return store.competitions.map((c, i) => ({
    index: i + 1,
    competitionName: c.name,
    category: c.category,
    juara1: getWinnerName(c.id, 1),
    juara2: getWinnerName(c.id, 2),
    juara3: getWinnerName(c.id, 3),
    status: c.status === 'Finished' ? 'Selesai' : 'Sedang Berlangsung'
  }));
});

function sendWinnersToMc(comp: any) {
  const mcPhone = store.settings.mcPhoneNumber ||
    store.committees.find(m => m.role.toLowerCase().includes('mc') || m.role.toLowerCase().includes('pembawa acara'))?.phone;

  if (!mcPhone || mcPhone === '-' || mcPhone.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Nomor MC Belum Diatur',
      text: 'Harap atur Nomor WhatsApp MC di menu Pengaturan atau di halaman Susunan Panitia.',
      confirmButtonColor: '#10b981'
    });
    return;
  }

  const j1 = getWinnerName(comp.id, 1);
  const j2 = getWinnerName(comp.id, 2);
  const j3 = getWinnerName(comp.id, 3);

  const winnersList = [
    { rank: 'Juara 1 🥇', name: j1 },
    { rank: 'Juara 2 🥈', name: j2 },
    { rank: 'Juara 3 🥉', name: j3 }
  ].filter(w => w.name && w.name !== 'Belum Ditetapkan' && w.name !== 'Unknown');

  const url = generateMcMessage(mcPhone, 'winner', {
    eventName: store.settings.eventName,
    competitionName: comp.name,
    winners: winnersList
  });

  window.open(url, '_blank');
}

function hasWinner(competitionId: string) {
  const winner = store.winners.find(w => w.competitionId === competitionId);
  return !!winner && (!!winner.firstPlaceId || !!winner.secondPlaceId || !!winner.thirdPlaceId);
}

async function confirmDeleteWinner(competitionId: string) {
  const comp = store.getCompetitionById(competitionId);
  const result = await Swal.fire({
    title: 'Reset / Hapus Juara?',
    text: `Penetapan juara untuk lomba ${comp?.name || 'ini'} akan dihapus dan status lomba diubah kembali menjadi In Progress.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Reset Juara',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626'
  });

  if (result.isConfirmed) {
    store.deleteWinner(competitionId);
    Swal.fire({
      icon: 'success',
      title: 'Juara Berhasil Direset',
      text: `Penetapan pemenang ${comp?.name} telah dibatalkan.`,
      timer: 1500,
      showConfirmButton: false
    });
  }
}

function getWinnerName(competitionId: string, rank: 1 | 2 | 3) {
  const winner = store.winners.find(w => w.competitionId === competitionId);
  if (!winner) return 'Belum Ditetapkan';

  let participantId = '';
  if (rank === 1) participantId = winner.firstPlaceId || '';
  if (rank === 2) participantId = winner.secondPlaceId || '';
  if (rank === 3) participantId = winner.thirdPlaceId || '';

  if (!participantId) return 'Belum Ditetapkan';
  const participant = store.getParticipantById(participantId);
  return participant ? participant.name : 'Unknown';
}

function exportXLSXReport() {
  const data = store.competitions.map(c => ({
    'ID Lomba': c.id,
    'Nama Lomba': c.name,
    'Kategori': c.category,
    'Lokasi': c.location,
    'Juara 1': getWinnerName(c.id, 1),
    'Juara 2': getWinnerName(c.id, 2),
    'Juara 3': getWinnerName(c.id, 3),
    'Poin Juara 1': c.pointFirst
  }));

  exportToXLSX([{ name: 'Hasil Lomba', data }], '17an_Arena_Hasil_Lomba.xlsx');
  Swal.fire({ icon: 'success', title: 'Ekspor XLSX Selesai!', timer: 1500, showConfirmButton: false });
}

function exportCSVReport() {
  const data = store.competitions.map(c => ({
    'Nama_Lomba': c.name,
    'Kategori': c.category,
    'Juara_1': getWinnerName(c.id, 1),
    'Juara_2': getWinnerName(c.id, 2),
    'Juara_3': getWinnerName(c.id, 3)
  }));

  exportToCSV(data, '17an_Arena_Hasil_Lomba.csv');
  Swal.fire({ icon: 'success', title: 'Ekspor CSV Selesai!', timer: 1500, showConfirmButton: false });
}

function exportSQLReport() {
  const rows = store.winners.map(w => {
    const comp = store.getCompetitionById(w.competitionId);
    return {
      id: w.id,
      competition_name: comp?.name || '',
      first_place_id: w.firstPlaceId || '',
      second_place_id: w.secondPlaceId || '',
      third_place_id: w.thirdPlaceId || '',
      decided_at: w.decidedAt
    };
  });

  exportToSQL('winners', rows, '17an_arena_winners.sql');
  Swal.fire({ icon: 'success', title: 'Ekspor SQL Selesai!', timer: 1500, showConfirmButton: false });
}
</script>
