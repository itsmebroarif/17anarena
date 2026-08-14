<template>
  <div class="space-y-6 pb-12">
    <!-- Top Action Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-lg uppercase tracking-wide">
            TIMELINE MODULE
          </span>
          <span class="text-xs text-slate-500 font-mono">A4 Ready-to-Print</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
          <span>Rundown Management & Susunan Acara</span>
        </h1>
        <p class="text-xs text-slate-500">
          Jadwal timeline kegiatan, durasi, peserta, penanggung jawab (PIC), lokasi arena, & status pelaksanaan acara 17-an.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="resetRundownToBojongLio"
          class="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2"
          title="Muat Ulang Susunan Acara Resmi Bojong Lio (21 Mata Acara)"
        >
          <i class="bi bi-arrow-counterclockwise text-sm"></i>
          <span>Reset Schedule Bojong Lio</span>
        </button>

        <button
          @click="openPrintModal"
          class="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 border border-slate-800"
        >
          <i class="bi bi-printer-fill text-amber-400 text-sm"></i>
          <span>Cetak Rundown Acara (A4)</span>
        </button>

        <button
          @click="openAddModal"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <i class="bi bi-plus-circle-fill text-sm"></i>
          <span>Tambah Agenda</span>
        </button>
      </div>
    </div>

    <!-- TIMELINE SUMMARY STATS (NO PRINT) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Total Agenda Acara</span>
          <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <i class="bi bi-clock-history"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-slate-900 font-mono">
          {{ store.rundownItems.length }} Agenda
        </p>
        <p class="text-[11px] text-slate-400">
          Susunan kronologis 17 Agustus 2026
        </p>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-blue-100 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Sedang Berlangsung</span>
          <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold animate-pulse">
            <i class="bi bi-play-circle-fill"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-blue-600 font-mono">
          {{ activeAgendaCount }} Agenda
        </p>
        <p class="text-[11px] text-slate-400">
          Acara live di arena sekarang
        </p>
      </div>

      <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-300 uppercase tracking-wide">Progress Acara</span>
          <div class="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-400 font-mono">
          {{ finishedCount }} / {{ store.rundownItems.length }} Selesai
        </p>
        <p class="text-[11px] text-slate-400">
          {{ (finishedCount / (store.rundownItems.length || 1) * 100).toFixed(0) }}% terselesaikan
        </p>
      </div>
    </div>

    <!-- FILTER BAR (NO PRINT) -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
      <div class="relative w-full sm:w-72">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari kegiatan, peserta, PIC..."
          class="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <select
          v-model="filterStatus"
          class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="ALL">Semua Status (Semua)</option>
          <option value="Belum Mulai">Belum Mulai</option>
          <option value="Sedang Berlangsung">Sedang Berlangsung</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>
    </div>

    <!-- DATA TABLE (NO PRINT SCREEN VIEW) -->
    <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs no-print">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-extrabold text-sm text-slate-900">
          Daftar Susunan Acara (Rundown 17 Agustus 2026)
        </h3>
        <span class="text-xs text-slate-400">Diurutkan berdasarkan waktu pelaksanaan</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[10px]">
              <th class="p-3.5 pl-6 w-10 text-center">No</th>
              <th class="p-3.5 w-32">Waktu</th>
              <th class="p-3.5 w-20 text-center">Durasi</th>
              <th class="p-3.5 min-w-[220px]">Kegiatan</th>
              <th class="p-3.5 w-28 text-center">Peserta</th>
              <th class="p-3.5 min-w-[200px]">Catatan / Format</th>
              <th class="p-3.5 w-36">PIC & Lokasi</th>
              <th class="p-3.5 text-center w-32">Status</th>
              <th class="p-3.5 pr-6 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="filteredRundown.length === 0">
              <td colspan="9" class="text-center py-12 text-slate-400 italic">
                Belum ada agenda rundown. Silakan klik "Tambah Agenda" atau "Reset Schedule Bojong Lio".
              </td>
            </tr>

            <tr v-for="(item, idx) in filteredRundown" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-3.5 pl-6 text-slate-400 font-mono text-center font-bold">{{ idx + 1 }}</td>
              <td class="p-3.5 font-mono font-black text-amber-800 whitespace-nowrap bg-amber-50/30">
                <i class="bi bi-clock-fill text-[10px] text-amber-500 mr-1"></i>
                {{ item.timeStart }} {{ item.timeEnd && item.timeEnd !== item.timeStart ? '– ' + item.timeEnd : '' }}
              </td>
              <td class="p-3.5 text-center font-mono text-slate-600 whitespace-nowrap">
                <span v-if="item.duration && item.duration !== '—'" class="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-[11px] text-slate-700">
                  {{ item.duration }}
                </span>
                <span v-else class="text-slate-300">—</span>
              </td>
              <td class="p-3.5 font-black text-slate-900">
                <div class="text-sm tracking-tight">{{ item.activity }}</div>
              </td>
              <td class="p-3.5 text-center whitespace-nowrap">
                <span
                  class="px-2.5 py-1 text-[10px] font-black rounded-lg border"
                  :class="participantBadgeClass(item.participants)"
                >
                  {{ item.participants || 'Semua' }}
                </span>
              </td>
              <td class="p-3.5 text-slate-600 text-[11px]">
                {{ item.notes || '—' }}
              </td>
              <td class="p-3.5 font-bold text-slate-800 text-[11px]">
                <div class="text-slate-900 font-bold">{{ item.pic }}</div>
                <div class="text-[10px] font-normal text-slate-400"><i class="bi bi-geo-alt-fill text-amber-500"></i> {{ item.location }}</div>
              </td>
              <td class="p-3.5 text-center whitespace-nowrap">
                <select
                  :value="item.status"
                  @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value as any)"
                  class="px-2.5 py-1 text-[10px] font-black rounded-lg border focus:outline-none cursor-pointer"
                  :class="statusBadgeClass(item.status)"
                >
                  <option value="Belum Mulai">Belum Mulai</option>
                  <option value="Sedang Berlangsung">Sedang Berlangsung ⚡</option>
                  <option value="Selesai">Selesai ✓</option>
                </select>
              </td>
              <td class="p-3.5 pr-6 text-center whitespace-nowrap space-x-1">
                <button
                  @click="openEditModal(item)"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                  title="Edit Agenda"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button
                  @click="deleteRundown(item.id)"
                  class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                  title="Hapus Agenda"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FORM MODAL (ADD / EDIT) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-scale-up">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-extrabold text-base text-slate-900">
            {{ isEditing ? 'Edit Agenda Rundown' : 'Tambah Agenda Rundown Baru' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveRundown" class="space-y-4 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">Tanggal Acara</label>
            <input
              v-model="form.date"
              type="text"
              placeholder="17 Agustus 2026"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
            />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Jam Mulai</label>
              <input
                v-model="form.timeStart"
                type="text"
                placeholder="08.30"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold focus:outline-none"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Jam Selesai</label>
              <input
                v-model="form.timeEnd"
                type="text"
                placeholder="08.45"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold focus:outline-none"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Durasi</label>
              <input
                v-model="form.duration"
                type="text"
                placeholder="15 mnt"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Nama Kegiatan / Agenda</label>
            <input
              v-model="form.activity"
              type="text"
              placeholder="Contoh: 🥨 Makan Kerupuk"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-extrabold"
            />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Target Peserta</label>
            <select
              v-model="form.participants"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Anak-anak">Anak-anak</option>
              <option value="Dewasa">Dewasa</option>
              <option value="Panitia">Panitia</option>
              <option value="—">—</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">PIC / Penanggung Jawab</label>
              <input
                v-model="form.pic"
                type="text"
                placeholder="Seksi Acara / Pertandingan"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Lokasi Arena</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="Arena A / Panggung Utama"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Status Pelaksanaan</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
            >
              <option value="Belum Mulai">Belum Mulai</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Catatan / Aturan</label>
            <input
              v-model="form.notes"
              type="text"
              placeholder="Contoh: Individu / MC, sambutan singkat"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div class="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-amber-600 text-white font-extrabold rounded-xl shadow-xs hover:bg-amber-700"
            >
              Simpan Agenda
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PRINT PREVIEW MODAL (A4 READY TO PRINT) -->
    <div v-if="showPrintModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 z-50 overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-5xl w-full p-6 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
        <!-- Close & Print Control Bar (NO PRINT) -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 no-print sticky top-0 bg-white z-10">
          <div>
            <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
              <i class="bi bi-file-earmark-pdf-fill text-amber-600"></i>
               Pratinjau Dokumen Cetak A4 — Rundown Susunan Acara
            </h3>
            <p class="text-xs text-slate-500">Lengkap dengan Kop Surat Resmi RT & Pengesahan Tanda Tangan</p>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="triggerPrint"
              class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <i class="bi bi-printer-fill text-sm"></i>
              <span>Cetak / Export PDF Sekarang</span>
            </button>

            <button
              @click="showPrintModal = false"
              class="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- PRINTABLE DOCUMENT WRAPPER -->
        <div id="printable-area">
          <OfficialPrintDocument
            title="DOKUMEN RUNDOWN & SUSUNAN ACARA HARIAN PERINGATAN 17 AGUSTUS 2026"
            subtitle="Jadwal Timeline Kegiatan, Durasi, Target Peserta, dan Catatan Teknis Lomba"
            docCode="RDN"
          >
            <!-- Print Data Table -->
            <table class="w-full border-collapse border border-slate-300 text-[10px] mb-6">
              <thead>
                <tr class="bg-slate-100 text-slate-800 font-bold uppercase text-[9px]">
                  <th class="border border-slate-300 p-2 text-center w-8">No</th>
                  <th class="border border-slate-300 p-2 w-28 text-center">Waktu</th>
                  <th class="border border-slate-300 p-2 w-16 text-center">Durasi</th>
                  <th class="border border-slate-300 p-2">Kegiatan</th>
                  <th class="border border-slate-300 p-2 w-24 text-center">Peserta</th>
                  <th class="border border-slate-300 p-2 w-48">Catatan</th>
                  <th class="border border-slate-300 p-2 w-32">PIC / Lokasi</th>
                  <th class="border border-slate-300 p-2 w-20 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in store.rundownItems" :key="item.id" class="border-b border-slate-200">
                  <td class="border border-slate-300 p-2 text-center font-mono font-bold">{{ idx + 1 }}</td>
                  <td class="border border-slate-300 p-2 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                    {{ item.timeStart }} {{ item.timeEnd && item.timeEnd !== item.timeStart ? '– ' + item.timeEnd : '' }}
                  </td>
                  <td class="border border-slate-300 p-2 text-center font-mono text-slate-700">
                    {{ item.duration || '—' }}
                  </td>
                  <td class="border border-slate-300 p-2 font-bold text-slate-900">
                    {{ item.activity }}
                  </td>
                  <td class="border border-slate-300 p-2 text-center font-bold text-slate-800">
                    {{ item.participants || 'Semua' }}
                  </td>
                  <td class="border border-slate-300 p-2 text-slate-700">
                    {{ item.notes || '—' }}
                  </td>
                  <td class="border border-slate-300 p-2 text-slate-800">
                    <div class="font-bold">{{ item.pic }}</div>
                    <div class="text-[9px] text-slate-500">{{ item.location }}</div>
                  </td>
                  <td class="border border-slate-300 p-2 text-center font-bold text-[9px]">
                    {{ item.status }}
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="text-[10px] text-slate-500 italic">
              * Jadwal ini dapat menyesuaikan kondisi lapangan pada hari H pelaksanaan. Seluruh panitia harap siaga di pos masing-masing 15 menit sebelum acara dimulai.
            </p>
          </OfficialPrintDocument>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { RundownItem } from '../types';
import { FIX_BOJONG_LIO_RUNDOWNS, StorageService } from '../services/storage';
import OfficialPrintDocument from '../components/OfficialPrintDocument.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();

const searchQuery = ref('');
const filterStatus = ref<'ALL' | 'Belum Mulai' | 'Sedang Berlangsung' | 'Selesai'>('ALL');

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref<string | null>(null);

const showPrintModal = ref(false);

const form = ref({
  date: '17 Agustus 2026',
  timeStart: '08.30',
  timeEnd: '08.45',
  duration: '15 mnt',
  activity: '',
  participants: 'Semua',
  pic: 'Seksi Acara',
  location: 'Panggung Utama',
  status: 'Belum Mulai' as 'Belum Mulai' | 'Sedang Berlangsung' | 'Selesai',
  notes: ''
});

const activeAgendaCount = computed(() => {
  return store.rundownItems.filter(r => r.status === 'Sedang Berlangsung').length;
});

const finishedCount = computed(() => {
  return store.rundownItems.filter(r => r.status === 'Selesai').length;
});

const filteredRundown = computed(() => {
  return store.rundownItems.filter(item => {
    const matchesSearch = !searchQuery.value ||
      item.activity.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.pic.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.participants && item.participants.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      item.location.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = filterStatus.value === 'ALL' || item.status === filterStatus.value;

    return matchesSearch && matchesStatus;
  });
});

function statusBadgeClass(status: string) {
  if (status === 'Selesai') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (status === 'Sedang Berlangsung') return 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse';
  return 'bg-slate-100 text-slate-700 border-slate-300';
}

function participantBadgeClass(p?: string) {
  if (p === 'Anak-anak') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (p === 'Dewasa') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (p === 'Panitia') return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function updateStatus(id: string, status: 'Belum Mulai' | 'Sedang Berlangsung' | 'Selesai') {
  store.updateRundownItem(id, { status });
}

function resetRundownToBojongLio() {
  Swal.fire({
    title: 'Reset Rundown Acara Resmi Bojong Lio?',
    text: 'Tindakan ini akan memuat 21 mata acara resmi 17 Agustus 2026.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: 'Ya, Reset Rundown',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      store.rundownItems = FIX_BOJONG_LIO_RUNDOWNS;
      StorageService.set('17an_rundown_items', FIX_BOJONG_LIO_RUNDOWNS);
      store.saveAll();
      Swal.fire({
        icon: 'success',
        title: 'Rundown Berhasil Di-Reset!',
        text: '21 susunan acara resmi Bojong Lio telah berhasil dimuat.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

function openAddModal() {
  isEditing.value = false;
  editId.value = null;
  form.value = {
    date: '17 Agustus 2026',
    timeStart: '08.30',
    timeEnd: '08.45',
    duration: '15 mnt',
    activity: '',
    participants: 'Semua',
    pic: 'Seksi Acara',
    location: 'Panggung Utama',
    status: 'Belum Mulai',
    notes: ''
  };
  showModal.value = true;
}

function openEditModal(item: RundownItem) {
  isEditing.value = true;
  editId.value = item.id;
  form.value = {
    date: item.date,
    timeStart: item.timeStart,
    timeEnd: item.timeEnd,
    duration: item.duration || '',
    activity: item.activity,
    participants: item.participants || 'Semua',
    pic: item.pic,
    location: item.location,
    status: item.status,
    notes: item.notes || ''
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveRundown() {
  if (isEditing.value && editId.value) {
    store.updateRundownItem(editId.value, { ...form.value });
    Swal.fire({
      icon: 'success',
      title: 'Agenda Rundown Diperbarui!',
      timer: 1200,
      showConfirmButton: false
    });
  } else {
    store.addRundownItem({ ...form.value });
    Swal.fire({
      icon: 'success',
      title: 'Agenda Rundown Ditambahkan!',
      timer: 1200,
      showConfirmButton: false
    });
  }
  closeModal();
}

function deleteRundown(id: string) {
  Swal.fire({
    title: 'Hapus Agenda Rundown Ini?',
    text: 'Agenda acara ini akan dihapus dari susunan acara.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      store.deleteRundownItem(id);
      Swal.fire({
        icon: 'success',
        title: 'Agenda Dihapus',
        timer: 1000,
        showConfirmButton: false
      });
    }
  });
}

function openPrintModal() {
  showPrintModal.value = true;
}

function triggerPrint() {
  window.print();
}
</script>

