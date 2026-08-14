<template>
  <div class="space-y-6 pb-12">
    <!-- Top Action Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg uppercase tracking-wide">
            FINANCE MODULE
          </span>
          <span class="text-xs text-slate-500 font-mono">A4 Ready-to-Print</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
          <span>Money Management & Laporan Kas</span>
        </h1>
        <p class="text-xs text-slate-500">
          Kelola arus pundi kas (Pemasukan & Pengeluaran) peringatan HUT Kemerdekaan RI ke-81. Lengkap dengan Kop Surat & Pengesahan Tanda Tangan.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetKasData"
          class="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5"
          title="Muat Ulang Transaksi Kas Resmi 2026"
        >
          <i class="bi bi-arrow-clockwise text-sm"></i>
          <span>Muat Data Kas 2026</span>
        </button>

        <button
          @click="openPrintModal"
          class="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 border border-slate-800"
        >
          <i class="bi bi-printer-fill text-emerald-400 text-sm"></i>
          <span>Cetak Laporan Kas (A4)</span>
        </button>

        <button
          @click="openAddModal"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <i class="bi bi-plus-circle-fill text-sm"></i>
          <span>Tambah Transaksi</span>
        </button>
      </div>
    </div>

    <!-- SUMMARY CARDS (NO PRINT) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
      <!-- Total Pemasukan -->
      <div class="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Total Pemasukan</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <i class="bi bi-arrow-down-left-circle-fill"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">
          Rp {{ totalIncome.toLocaleString('id-ID') }}
        </p>
        <p class="text-[11px] text-slate-400">
          Dari {{ incomeCount }} transaksi (Iuran, Kas, Sponsor)
        </p>
      </div>

      <!-- Total Pengeluaran -->
      <div class="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Total Pengeluaran</span>
          <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <i class="bi bi-arrow-up-right-circle-fill"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-rose-600 font-mono">
          Rp {{ totalExpense.toLocaleString('id-ID') }}
        </p>
        <p class="text-[11px] text-slate-400">
          Untuk {{ expenseCount }} item keperluan acara
        </p>
      </div>

      <!-- Saldo Kas Saat Ini -->
      <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-2 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-300 uppercase tracking-wide">Saldo Akhir Kas</span>
          <div class="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
            <i class="bi bi-wallet2"></i>
          </div>
        </div>
        <p class="text-2xl font-black font-mono" :class="netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'">
          Rp {{ netBalance.toLocaleString('id-ID') }}
        </p>
        <p class="text-[11px] text-slate-400">
          {{ netBalance >= 0 ? 'Surplus / Kas Tersedia' : 'Defisit Kas' }}
        </p>
      </div>
    </div>

    <!-- FILTER & SEARCH BAR (NO PRINT) -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
      <div class="relative w-full sm:w-72">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari transaksi..."
          class="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <select
          v-model="filterType"
          class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="ALL">Semua Jenis (Semua)</option>
          <option value="Pemasukan">Pemasukan (+)</option>
          <option value="Pengeluaran">Pengeluaran (-)</option>
        </select>
      </div>
    </div>

    <!-- DATA TABLE (NO PRINT SCREEN VIEW) -->
    <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs no-print">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-extrabold text-sm text-slate-900">
          Rincian Catatan Transaksi ({{ filteredTransactions.length }})
        </h3>
        <span class="text-xs text-slate-400">Diperbarui secara realtime</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[10px]">
              <th class="p-3.5 pl-6">No</th>
              <th class="p-3.5">Tanggal</th>
              <th class="p-3.5">Jenis</th>
              <th class="p-3.5">Kategori</th>
              <th class="p-3.5">Keterangan / Rincian</th>
              <th class="p-3.5 text-right">Nominal (Rp)</th>
              <th class="p-3.5">Pencatat</th>
              <th class="p-3.5 pr-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="8" class="text-center py-12 text-slate-400 italic">
                Belum ada transaksi recorded. Silakan klik "Tambah Transaksi".
              </td>
            </tr>

            <tr v-for="(tx, idx) in filteredTransactions" :key="tx.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-3.5 pl-6 text-slate-400 font-mono">{{ idx + 1 }}</td>
              <td class="p-3.5 text-slate-700 font-mono whitespace-nowrap">{{ tx.date }}</td>
              <td class="p-3.5">
                <span
                  class="px-2 py-0.5 text-[10px] font-black rounded-md uppercase"
                  :class="tx.type === 'Pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                >
                  {{ tx.type }}
                </span>
              </td>
              <td class="p-3.5 font-bold text-slate-900 whitespace-nowrap">{{ tx.category }}</td>
              <td class="p-3.5 text-slate-600 max-w-xs">{{ tx.description }}</td>
              <td
                class="p-3.5 text-right font-extrabold font-mono text-sm whitespace-nowrap"
                :class="tx.type === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'"
              >
                {{ tx.type === 'Pemasukan' ? '+' : '-' }} Rp {{ tx.amount.toLocaleString('id-ID') }}
              </td>
              <td class="p-3.5 text-slate-500 whitespace-nowrap">{{ tx.recordedBy || 'Bendahara' }}</td>
              <td class="p-3.5 pr-6 text-center whitespace-nowrap space-x-1">
                <button
                  @click="openEditModal(tx)"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                  title="Edit Transaksi"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button
                  @click="deleteTx(tx.id)"
                  class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                  title="Hapus Transaksi"
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
            {{ isEditing ? 'Edit Transaksi Kas' : 'Tambah Transaksi Baru' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveTransaction" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Tanggal</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Jenis Transaksi</label>
              <select
                v-model="form.type"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
              >
                <option value="Pemasukan">Pemasukan (+)</option>
                <option value="Pengeluaran">Pengeluaran (-)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Kategori</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="Contoh: Iuran Warga, Sponsor, Hadiah, Konsumsi"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Rincian / Keterangan</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Jelaskan detail pengeluaran/pemasukan..."
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Nominal (Rp)</label>
              <input
                v-model.number="form.amount"
                type="number"
                min="0"
                step="1000"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Pencatat / PJ</label>
              <input
                v-model="form.recordedBy"
                type="text"
                placeholder="Bendahara Panitia"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
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
              class="px-5 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow-xs hover:bg-emerald-700"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PRINT PREVIEW MODAL (A4 READY TO PRINT) -->
    <div v-if="showPrintModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 z-50 overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
        <!-- Close & Print Control Bar (NO PRINT) -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 no-print sticky top-0 bg-white z-10">
          <div>
            <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
              <i class="bi bi-file-earmark-pdf-fill text-red-600"></i>
               Pratinjau Dokumen Cetak A4 — Laporan Keuangan Kas
            </h3>
            <p class="text-xs text-slate-500">Lengkap dengan Kop Surat Resmi RT & Pengesahan Tanda Tangan</p>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="triggerPrint"
              class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
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
            title="LAPORAN REKAPITULASI KEUANGAN & KAS KEMERDEKAAN"
            subtitle="Ringkasan Pemasukan, Pengeluaran, dan Saldo Kas Peringatan HUT RI ke-81"
            docCode="KAS"
          >
            <!-- Summary Table Header -->
            <div class="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-center">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Total Pemasukan</span>
                <span class="font-black text-sm text-emerald-700 font-mono">Rp {{ totalIncome.toLocaleString('id-ID') }}</span>
              </div>
              <div class="text-center border-x border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Total Pengeluaran</span>
                <span class="font-black text-sm text-rose-700 font-mono">Rp {{ totalExpense.toLocaleString('id-ID') }}</span>
              </div>
              <div class="text-center">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Sisa Saldo Kas</span>
                <span class="font-black text-sm font-mono" :class="netBalance >= 0 ? 'text-slate-900' : 'text-rose-700'">
                  Rp {{ netBalance.toLocaleString('id-ID') }}
                </span>
              </div>
            </div>

            <!-- Print Data Table -->
            <table class="w-full border-collapse border border-slate-300 text-[11px] mb-6">
              <thead>
                <tr class="bg-slate-100 text-slate-800 font-bold uppercase text-[9px]">
                  <th class="border border-slate-300 p-2 text-center w-8">No</th>
                  <th class="border border-slate-300 p-2 w-24">Tanggal</th>
                  <th class="border border-slate-300 p-2 w-20 text-center">Jenis</th>
                  <th class="border border-slate-300 p-2 w-32">Kategori</th>
                  <th class="border border-slate-300 p-2">Keterangan Transaksi</th>
                  <th class="border border-slate-300 p-2 text-right w-28">Pemasukan</th>
                  <th class="border border-slate-300 p-2 text-right w-28">Pengeluaran</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tx, idx) in store.moneyTransactions" :key="tx.id" class="border-b border-slate-200">
                  <td class="border border-slate-300 p-2 text-center font-mono">{{ idx + 1 }}</td>
                  <td class="border border-slate-300 p-2 font-mono whitespace-nowrap">{{ tx.date }}</td>
                  <td class="border border-slate-300 p-2 text-center font-bold">
                    {{ tx.type }}
                  </td>
                  <td class="border border-slate-300 p-2 font-bold text-slate-900">{{ tx.category }}</td>
                  <td class="border border-slate-300 p-2 text-slate-700">{{ tx.description }}</td>
                  <td class="border border-slate-300 p-2 text-right font-mono text-emerald-700 font-bold">
                    <span v-if="tx.type === 'Pemasukan'">Rp {{ tx.amount.toLocaleString('id-ID') }}</span>
                    <span v-else>-</span>
                  </td>
                  <td class="border border-slate-300 p-2 text-right font-mono text-rose-700 font-bold">
                    <span v-if="tx.type === 'Pengeluaran'">Rp {{ tx.amount.toLocaleString('id-ID') }}</span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-slate-100 font-bold text-slate-900">
                  <td colspan="5" class="border border-slate-300 p-2 text-right uppercase text-[10px]">TOTAL KUMULATIF:</td>
                  <td class="border border-slate-300 p-2 text-right font-mono text-emerald-700">Rp {{ totalIncome.toLocaleString('id-ID') }}</td>
                  <td class="border border-slate-300 p-2 text-right font-mono text-rose-700">Rp {{ totalExpense.toLocaleString('id-ID') }}</td>
                </tr>
                <tr class="bg-slate-200 font-black text-slate-900">
                  <td colspan="5" class="border border-slate-300 p-2 text-right uppercase text-[10px]">SALDO AKHIR (SURPLUS/DEFISIT):</td>
                  <td colspan="2" class="border border-slate-300 p-2 text-right font-mono text-sm text-slate-900">
                    Rp {{ netBalance.toLocaleString('id-ID') }}
                  </td>
                </tr>
              </tfoot>
            </table>

            <p class="text-[10px] text-slate-500 italic">
              * Demikian laporan pertanggungjawaban keuangan kas ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.
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
import { MoneyTransaction } from '../types';
import { FIX_BOJONG_LIO_MONEY_TRANSACTIONS } from '../services/storage';
import OfficialPrintDocument from '../components/OfficialPrintDocument.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();

function resetKasData() {
  Swal.fire({
    title: 'Muat Ulang Transaksi Kas 2026?',
    text: 'Ini akan memuat ulang data transaksi pundi kas resmi (Pemasukan Rp2.028.000, Pengeluaran Rp169.000, Saldo Rp1.859.000).',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: 'Ya, Muat Data Kas',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      store.moneyTransactions = JSON.parse(JSON.stringify(FIX_BOJONG_LIO_MONEY_TRANSACTIONS));
      store.saveAll();
      Swal.fire({
        icon: 'success',
        title: 'Data Kas Berhasil Dimuat!',
        text: 'Laporan keuangan kas telah diperbarui.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

const searchQuery = ref('');
const filterType = ref<'ALL' | 'Pemasukan' | 'Pengeluaran'>('ALL');

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref<string | null>(null);

const showPrintModal = ref(false);

const form = ref({
  date: new Date().toISOString().substring(0, 10),
  type: 'Pemasukan' as 'Pemasukan' | 'Pengeluaran',
  category: '',
  description: '',
  amount: 0,
  recordedBy: 'Bendahara Panitia'
});

const totalIncome = computed(() => {
  return store.moneyTransactions
    .filter(t => t.type === 'Pemasukan')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const totalExpense = computed(() => {
  return store.moneyTransactions
    .filter(t => t.type === 'Pengeluaran')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const netBalance = computed(() => totalIncome.value - totalExpense.value);

const incomeCount = computed(() => store.moneyTransactions.filter(t => t.type === 'Pemasukan').length);
const expenseCount = computed(() => store.moneyTransactions.filter(t => t.type === 'Pengeluaran').length);

const filteredTransactions = computed(() => {
  return store.moneyTransactions.filter(t => {
    const matchesSearch = !searchQuery.value ||
      t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (t.recordedBy && t.recordedBy.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesType = filterType.value === 'ALL' || t.type === filterType.value;

    return matchesSearch && matchesType;
  });
});

function openAddModal() {
  isEditing.value = false;
  editId.value = null;
  form.value = {
    date: new Date().toISOString().substring(0, 10),
    type: 'Pemasukan',
    category: '',
    description: '',
    amount: 100000,
    recordedBy: 'Bendahara Panitia'
  };
  showModal.value = true;
}

function openEditModal(tx: MoneyTransaction) {
  isEditing.value = true;
  editId.value = tx.id;
  form.value = {
    date: tx.date,
    type: tx.type,
    category: tx.category,
    description: tx.description,
    amount: tx.amount,
    recordedBy: tx.recordedBy || 'Bendahara Panitia'
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveTransaction() {
  if (isEditing.value && editId.value) {
    store.updateMoneyTransaction(editId.value, { ...form.value });
    Swal.fire({
      icon: 'success',
      title: 'Transaksi Diperbarui!',
      timer: 1200,
      showConfirmButton: false
    });
  } else {
    store.addMoneyTransaction({ ...form.value });
    Swal.fire({
      icon: 'success',
      title: 'Transaksi Ditambahkan!',
      timer: 1200,
      showConfirmButton: false
    });
  }
  closeModal();
}

function deleteTx(id: string) {
  Swal.fire({
    title: 'Hapus Transaksi Ini?',
    text: 'Data transaksi akan dihapus dari laporan keuangan kas.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      store.deleteMoneyTransaction(id);
      Swal.fire({
        icon: 'success',
        title: 'Transaksi Dihapus',
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
