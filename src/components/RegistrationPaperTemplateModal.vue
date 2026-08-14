<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
    <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto">
      
      <!-- Modal Header (No Print) -->
      <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20 no-print">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-xl font-black shadow-md shadow-red-500/30">
            <i class="bi bi-file-earmark-text-fill"></i>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Paper Template Pendaftaran Peserta Lomba (Bulk Backup)
            </h2>
            <p class="text-xs text-slate-500">
              Template Berkas Cetak Resmi (No | Nama Peserta | Kategori Usia | Nama Lomba)
            </p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Tutup Modal"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <!-- Controls & Filters Bar (No Print) -->
      <div class="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-3.5 no-print">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Filter Lomba -->
          <div>
            <label class="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              <i class="bi bi-flag-fill text-red-600"></i> Filter Cabang Lomba:
            </label>
            <select
              v-model="filterCompId"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="ALL">-- Semua Cabang Lomba (Bulking) --</option>
              <option v-for="c in store.competitions" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.category }})
              </option>
            </select>
          </div>

          <!-- Filter Kategori Usia -->
          <div>
            <label class="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              <i class="bi bi-person-fill text-amber-600"></i> Kategori Usia & Tingkat:
            </label>
            <select
              v-model="filterAgeGroup"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="ALL">-- Semua Kategori Usia & Tingkat --</option>
              <optgroup label="👶 Anak-anak (TK & SD)">
                <option value="TK">👶 TK</option>
                <option value="SD">👶 Semua SD (Kelas 1-6)</option>
                <option value="SD Kelas 1">└ SD Kelas 1</option>
                <option value="SD Kelas 2">└ SD Kelas 2</option>
                <option value="SD Kelas 3">└ SD Kelas 3</option>
                <option value="SD Kelas 4">└ SD Kelas 4</option>
                <option value="SD Kelas 5">└ SD Kelas 5</option>
                <option value="SD Kelas 6">└ SD Kelas 6</option>
              </optgroup>
              <optgroup label="👦 Remaja (SMP & SMA)">
                <option value="SMP">👦 SMP</option>
                <option value="SMA">👦 SMA</option>
              </optgroup>
              <optgroup label="👨 Dewasa">
                <option value="Dewasa">👨 Dewasa</option>
              </optgroup>
            </select>
          </div>

          <!-- Search Query -->
          <div>
            <label class="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              <i class="bi bi-search text-blue-600"></i> Cari Peserta:
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama peserta / lomba..."
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs">
          <div class="flex items-center space-x-3 text-slate-600 font-medium">
            <span>Total Data: <strong class="text-red-600 font-extrabold text-sm">{{ formattedList.length }}</strong> Peserta</span>
            <span class="text-slate-300">|</span>
            <label class="flex items-center space-x-1.5 cursor-pointer text-slate-700 font-bold">
              <input type="checkbox" v-model="showCodeCol" class="rounded text-red-600 focus:ring-red-500" />
              <span>Tampilkan Kode Peserta / RT</span>
            </label>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center space-x-2">
            <button
              @click="downloadCsvBackup"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              title="Download backup file CSV Excel"
            >
              <i class="bi bi-file-earmark-excel-fill"></i>
              <span>Backup CSV</span>
            </button>

            <button
              @click="triggerPrint"
              class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <i class="bi bi-printer-fill"></i>
              <span>Cetak / Backup PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Printable Area Container -->
      <div class="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-200/70">
        <div
          id="printable-paper-template"
          class="bg-white text-slate-900 p-8 sm:p-12 shadow-xl mx-auto border border-slate-300 rounded-2xl font-sans max-w-4xl print:max-w-full print:shadow-none print:border-none print:p-0 print:m-0"
        >
          <!-- KOP SURAT RESMI PERINGATAN HUT RI -->
          <div class="border-b-4 border-slate-900 pb-4 mb-6 flex items-center justify-between gap-4 border-double">
            <div class="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-2xl shrink-0">
              🇮🇩
            </div>

            <div class="text-center flex-1 space-y-0.5">
              <h3 class="font-extrabold text-[11px] tracking-widest text-red-600 uppercase">
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

            <div class="w-14 h-14 rounded-2xl border-2 border-red-600/30 bg-red-50 text-red-700 flex flex-col items-center justify-center shrink-0">
              <span class="font-black text-[10px]">HUT RI</span>
              <span class="font-black text-base leading-none">81</span>
            </div>
          </div>

          <!-- DOCUMENT TITLE -->
          <div class="text-center mb-6">
            <h2 class="font-black text-base sm:text-lg text-slate-900 uppercase underline decoration-2 underline-offset-4">
              BERKAS REKAPITULASI PENDAFTARAN PESERTA LOMBA (BULK TEMPLATE)
            </h2>
            <p class="text-xs font-bold text-slate-600 mt-1">
              Dokumen Resmi Pendaftaran Lomba Masal Panitia
            </p>
            <div class="flex items-center justify-center gap-4 text-[10px] text-slate-500 mt-1 font-mono">
              <span>Filter Lomba: <strong>{{ selectedCompName }}</strong></span>
              <span>•</span>
              <span>Tanggal Cetak: <strong>{{ formattedDate }}</strong></span>
            </div>
          </div>

          <!-- MAIN TABLE: Exact Columns Requested (No | Nama Peserta | Kategori Usia | Nama Lomba) -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse border-2 border-slate-900 text-xs">
              <thead>
                <tr class="bg-slate-900 text-white uppercase font-black text-center text-[11px] tracking-wider">
                  <th class="p-3 border border-slate-800 w-12">No</th>
                  <th class="p-3 border border-slate-800 text-left">Nama Peserta</th>
                  <th class="p-3 border border-slate-800 w-44 text-center">Kategori Usia</th>
                  <th class="p-3 border border-slate-800 text-left">Nama Lomba</th>
                  <th v-if="showCodeCol" class="p-3 border border-slate-800 w-28 text-center">Kode / RT</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-300">
                <tr
                  v-for="(item, idx) in formattedList"
                  :key="idx"
                  :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
                >
                  <!-- No -->
                  <td class="p-2.5 border border-slate-300 text-center font-bold text-slate-800">
                    {{ idx + 1 }}
                  </td>

                  <!-- Nama Peserta -->
                  <td class="p-2.5 border border-slate-300 font-extrabold text-slate-900">
                    {{ item.participantName }}
                  </td>

                  <!-- Kategori Usia (No | Nama Peserta | Kategori Usia | Nama Lomba) -->
                  <td class="p-2.5 border border-slate-300 text-center font-bold">
                    <span
                      class="px-2.5 py-1 rounded-lg text-[11px] inline-block font-extrabold border shadow-2xs"
                      :class="item.categoryLevel.includes('TK') ? 'bg-amber-100 text-amber-950 border-amber-300' :
                              item.categoryLevel.includes('SD') ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                              item.categoryLevel.includes('SMP') || item.categoryLevel.includes('SMA') ? 'bg-indigo-100 text-indigo-950 border-indigo-300' :
                              'bg-blue-100 text-blue-950 border-blue-300'"
                    >
                      {{ item.categoryLevel }}
                    </span>
                    <span class="block text-[10px] text-slate-500 font-semibold mt-0.5">
                      {{ item.age }} Tahun
                    </span>
                  </td>

                  <!-- Nama Lomba -->
                  <td class="p-2.5 border border-slate-300 font-bold text-slate-800">
                    {{ item.competitionName }}
                    <span class="block text-[10px] text-slate-500 font-medium">
                      {{ item.competitionCategory }}
                    </span>
                  </td>

                  <!-- Kode / RT (Optional) -->
                  <td v-if="showCodeCol" class="p-2.5 border border-slate-300 text-center font-mono font-bold text-red-700">
                    {{ item.participantCode }}
                    <span class="block text-[10px] text-slate-500 font-normal">RT {{ item.rt }}</span>
                  </td>
                </tr>

                <tr v-if="formattedList.length === 0">
                  <td :colspan="showCodeCol ? 5 : 4" class="p-8 text-center text-slate-400 font-bold">
                    Belum ada data pendaftaran yang sesuai dengan filter. Silakan lakukan pendaftaran terlebih dahulu.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- SIGNATURE & VERIFICATION FOOTER -->
          <div class="mt-10 pt-6 border-t-2 border-slate-300 page-break-inside-avoid">
            <div class="flex items-center justify-between text-xs text-slate-800 font-medium px-2">
              <div class="text-center space-y-1 min-w-[180px]">
                <p class="font-bold text-slate-600 text-[11px]">Mengetahui,</p>
                <p class="font-black text-slate-900 uppercase text-xs">Ketua RT 05 / RW 02</p>

                <div class="h-16 flex items-center justify-center">
                  <div class="text-[10px] text-slate-300 italic border border-dashed border-slate-300 rounded px-2 py-0.5 print:hidden">
                    (Tanda Tangan RT)
                  </div>
                </div>

                <p class="font-extrabold text-slate-900 underline text-xs">
                  {{ rtName }}
                </p>
              </div>

              <div class="text-center text-[10px] text-slate-400 italic space-y-1 hidden sm:block">
                <p class="font-bold text-slate-600">{{ store.settings.location || 'Depok' }}, {{ formattedDate }}</p>
                <div class="w-14 h-14 rounded-full border border-red-500/20 mx-auto flex items-center justify-center text-red-500 font-bold text-[8px] uppercase tracking-tighter rotate-12">
                  PANITIA 17AN
                </div>
              </div>

              <div class="text-center space-y-1 min-w-[180px]">
                <p class="font-bold text-slate-600 text-[11px]">{{ store.settings.location || 'Depok' }}, {{ formattedDate }}</p>
                <p class="font-black text-slate-900 uppercase text-xs">Ketua Pelaksana 17-an</p>

                <div class="h-16 flex items-center justify-center">
                  <div class="text-[10px] text-slate-300 italic border border-dashed border-slate-300 rounded px-2 py-0.5 print:hidden">
                    (Tanda Tangan Pelaksana)
                  </div>
                </div>

                <p class="font-extrabold text-slate-900 underline text-xs">
                  {{ headName }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer (No Print) -->
      <div class="p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between bg-slate-50 sticky bottom-0 no-print">
        <button
          @click="$emit('close')"
          class="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          Tutup
        </button>

        <div class="flex items-center space-x-2">
          <button
            @click="downloadCsvBackup"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i class="bi bi-download"></i>
            <span>Backup Data (CSV)</span>
          </button>

          <button
            @click="triggerPrint"
            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <i class="bi bi-printer-fill"></i>
            <span>Cetak / Save PDF A4</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import Swal from 'sweetalert2';

defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);

const store = useArenaStore();

const filterCompId = ref('ALL');
const filterAgeGroup = ref('ALL');
const searchQuery = ref('');
const showCodeCol = ref(true);

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const selectedCompName = computed(() => {
  if (filterCompId.value === 'ALL') return 'Semua Cabang Lomba (Bulk Master)';
  const comp = store.competitions.find(c => c.id === filterCompId.value);
  return comp ? `${comp.name} (${comp.category})` : 'Cabang Lomba';
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

// Full joined list
const formattedList = computed(() => {
  let list = store.registrations.map(reg => {
    const part = store.participants.find(p => p.id === reg.participantId);
    const comp = store.competitions.find(c => c.id === reg.competitionId);

    const age = part?.age || 10;
    
    // Determine category level
    let categoryLevel = part?.categoryLevel;
    if (!categoryLevel) {
      if (part?.notes && part.notes.includes('Dewasa')) {
        categoryLevel = 'Dewasa';
      } else if (age <= 6) {
        categoryLevel = 'Anak-anak (TK)';
      } else if (age === 7) {
        categoryLevel = 'Anak-anak (SD Kelas 1)';
      } else if (age === 8) {
        categoryLevel = 'Anak-anak (SD Kelas 2)';
      } else if (age === 9) {
        categoryLevel = 'Anak-anak (SD Kelas 3)';
      } else if (age === 10) {
        categoryLevel = 'Anak-anak (SD Kelas 4)';
      } else if (age === 11) {
        categoryLevel = 'Anak-anak (SD Kelas 5)';
      } else if (age === 12) {
        categoryLevel = 'Anak-anak (SD Kelas 6)';
      } else if (age >= 13 && age <= 15) {
        categoryLevel = 'Remaja (SMP)';
      } else if (age >= 16 && age <= 18) {
        categoryLevel = 'Remaja (SMA)';
      } else {
        categoryLevel = 'Dewasa';
      }
    }

    let ageGroup = 'Anak-anak';
    if (categoryLevel.includes('Dewasa') || comp?.category === 'Dewasa' || age >= 19) {
      ageGroup = 'Dewasa';
    } else if (categoryLevel.includes('Remaja') || age >= 13) {
      ageGroup = 'Remaja';
    }

    return {
      registrationId: reg.id,
      participantId: reg.participantId,
      competitionId: reg.competitionId,
      participantName: part?.name || 'Peserta Noname',
      age: age,
      ageGroup: ageGroup,
      categoryLevel: categoryLevel,
      rt: part?.address?.includes('RT') ? part.address : '05',
      competitionName: comp?.name || 'Lomba Umum',
      competitionCategory: comp?.category || 'Umum',
      participantCode: reg.participantNumber || reg.id
    };
  });

  // Apply filters
  if (filterCompId.value !== 'ALL') {
    list = list.filter(item => item.competitionId === filterCompId.value);
  }

  if (filterAgeGroup.value !== 'ALL') {
    const fKey = filterAgeGroup.value;
    list = list.filter(item => {
      if (fKey === 'SD') return item.categoryLevel.includes('SD');
      return item.categoryLevel.includes(fKey) || item.ageGroup === fKey;
    });
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(item =>
      item.participantName.toLowerCase().includes(q) ||
      item.competitionName.toLowerCase().includes(q) ||
      item.participantCode.toLowerCase().includes(q)
    );
  }

  return list;
});

function triggerPrint() {
  window.print();
}

function downloadCsvBackup() {
  if (formattedList.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Tidak Ada Data',
      text: 'Tidak ada data pendaftaran untuk di-backup!',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  const headers = ['No', 'Nama Peserta', 'Kategori Usia', 'Umur', 'Nama Lomba', 'Kode Peserta'];
  const rows = formattedList.value.map((item, idx) => [
    idx + 1,
    `"${item.participantName}"`,
    `"${item.ageGroup}"`,
    item.age,
    `"${item.competitionName}"`,
    `"${item.participantCode}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Backup_Pendaftaran_Bulking_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Backup Data CSV Berhasil Diunduh!',
    showConfirmButton: false,
    timer: 2000
  });
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background-color: white !important;
  }

  #printable-paper-template {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
