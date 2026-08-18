<template>
  <div class="space-y-6 pb-12">
    <!-- Top Action Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-black rounded-lg uppercase tracking-wide">
            BUDGETING MODULE
          </span>
          <span class="text-xs text-slate-500 font-mono">A4 Ready-to-Print</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
          <span>RAB Management (Rencana Anggaran Biaya)</span>
        </h1>
        <p class="text-xs text-slate-500">
          Perencanaan & perincian estimasi biaya serta realisasi pengeluaran per Seksi/Divisi Panitia 17-an. Dilengkapi Kop Surat & Tanda Tangan Pengesahan.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="resetToDefaultData"
          class="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5"
          title="Muat Ulang Data Belanjaan & Kas 17 Agustus 2026"
        >
          <i class="bi bi-arrow-clockwise text-sm"></i>
          <span>Muat Data 17 Agustus 2026</span>
        </button>

        <button
          @click="triggerExcelFileInput"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:scale-105"
          title="Import file Excel (.xlsx / .xls) data transaksi anggaran"
        >
          <i class="bi bi-file-earmark-excel-fill text-amber-300 text-sm"></i>
          <span>Import Excel</span>
        </button>
        <input
          ref="excelFileInput"
          type="file"
          accept=".xlsx, .xls, .csv"
          class="hidden"
          @change="handleExcelImport"
        />

        <button
          v-if="store.rabItems.length > 0"
          @click="isReadMode = !isReadMode"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <i :class="isReadMode ? 'bi bi-pencil-square' : 'bi bi-eye-fill'" class="text-sm"></i>
          <span>{{ isReadMode ? 'Mode Edit Seksi' : 'Mode Tabel Excel' }}</span>
        </button>

        <button
          @click="openPrintModal"
          class="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 border border-slate-800"
        >
          <i class="bi bi-printer-fill text-indigo-400 text-sm"></i>
          <span>Cetak Dokumen RAB (A4)</span>
        </button>

        <button
          @click="openAddModal"
          class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <i class="bi bi-plus-circle-fill text-sm"></i>
          <span>Tambah Item RAB</span>
        </button>
      </div>
    </div>

    <!-- RANGKUMAN DANA PENGELUARAN 2026 (SUMMARY CARDS - NO PRINT) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
      <!-- Total Pemasukan -->
      <div class="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Pemasukan</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <i class="bi bi-wallet2"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">
          Rp {{ totalIncome.toLocaleString('id-ID') }}
        </p>
        <p class="text-[11px] text-slate-400">
          Uang Sumbangan Cash & Saldo Kak Arif
        </p>
      </div>

      <!-- Total Pengeluaran -->
      <div class="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Pengeluaran</span>
          <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <i class="bi bi-cart-check-fill"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-rose-600 font-mono">
          Rp {{ totalExpense.toLocaleString('id-ID') }}
        </p>
        <p class="text-[11px] text-slate-400">
          Konsumsi Kopi, Indocafe, Roma & Air Gelas
        </p>
      </div>

      <!-- Sisa Uang -->
      <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-slate-300 uppercase tracking-wide">Sisa Uang</span>
          <div class="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
            <i class="bi bi-cash-stack"></i>
          </div>
        </div>
        <p class="text-2xl font-black text-amber-400 font-mono">
          Rp {{ balance.toLocaleString('id-ID') }}
        </p>
        <p class="text-[11px] text-slate-400">
          Saldo Kas Tersedia Saat Ini
        </p>
      </div>
    </div>

    <!-- FILTER BY SECTION (NO PRINT) -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
      <div class="relative w-full sm:w-72">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari item RAB..."
          class="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <select
          v-model="selectedSection"
          class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="ALL">Semua Seksi / Divisi ({{ sectionsList.length }})</option>
          <option v-for="sec in sectionsList" :key="sec" :value="sec">{{ sec }}</option>
        </select>
      </div>
    </div>

    <!-- READ MODE EXCEL SPREADSHEET VIEW (NO PRINT SCREEN VIEW) -->
    <div v-if="isReadMode" class="bg-white rounded-3xl border-2 border-slate-300 shadow-md overflow-hidden no-print font-sans space-y-4 p-4">
      <div class="bg-slate-100 p-4 rounded-2xl border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
            <i class="bi bi-file-earmark-excel-fill"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md uppercase border border-emerald-300">
                READ MODE ACTIVE
              </span>
              <span class="text-xs text-slate-500 font-mono">Excel Spreadsheet View</span>
            </div>
            <h2 class="text-base font-black text-slate-900 tracking-tight">
              Tabel Transaksi Anggaran (Hasil Import Excel)
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="exportToExcel"
            class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <i class="bi bi-download"></i>
            <span>Export XLSX</span>
          </button>

          <button
            @click="isReadMode = false"
            class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <i class="bi bi-pencil-square"></i>
            <span>Ubah Data (Edit Mode)</span>
          </button>
        </div>
      </div>

      <!-- Excel-Styled 2-Tier Header Spreadsheet Table -->
      <div class="overflow-x-auto border border-slate-300 rounded-2xl bg-white">
        <table class="w-full border-collapse text-xs">
          <thead>
            <!-- Group Header Row (Row 1) -->
            <tr class="bg-blue-100 text-slate-900 font-black text-center text-[11px] border-b border-slate-300">
              <th rowspan="2" class="border border-slate-300 p-3 bg-blue-200 text-slate-800 w-12">
                No
              </th>
              <th colspan="3" class="border border-slate-300 p-2.5 bg-blue-200 text-indigo-950 uppercase tracking-wide">
                ITEM
              </th>
              <th colspan="2" class="border border-slate-300 p-2.5 bg-indigo-200 text-indigo-950 uppercase tracking-wide">
                Harga Overall
              </th>
              <th colspan="2" class="border border-slate-300 p-2.5 bg-slate-200 text-slate-800 uppercase tracking-wide">
                Info
              </th>
              <th rowspan="2" class="border border-slate-300 p-3 bg-slate-200 text-slate-800 w-24">
                Aksi
              </th>
            </tr>
            <!-- Sub Header Row (Row 2) -->
            <tr class="bg-blue-50 text-slate-800 font-bold text-center text-[11px] border-b border-slate-300">
              <th class="border border-slate-300 p-2 text-left min-w-[180px]">Nama Item</th>
              <th class="border border-slate-300 p-2 w-16">Qty</th>
              <th class="border border-slate-300 p-2 w-28">Satuan Barang</th>
              <th class="border border-slate-300 p-2 text-right w-32">Harga Satuan</th>
              <th class="border border-slate-300 p-2 text-right w-32">Harga Total</th>
              <th class="border border-slate-300 p-2 w-28">Tanggal</th>
              <th class="border border-slate-300 p-2 w-32">Status / Notes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 font-medium">
            <tr v-if="store.rabItems.length === 0">
              <td colspan="9" class="p-8 text-center text-slate-400 italic">
                Belum ada data transaksi anggaran. Klik "Muat Data 17 Agustus 2026" atau "Import Excel".
              </td>
            </tr>
            <tr
              v-for="(item, idx) in store.rabItems"
              :key="item.id"
              class="hover:bg-blue-50/50 transition-colors"
            >
              <td class="border border-slate-300 p-2.5 text-center font-mono font-bold text-slate-500 bg-slate-50">
                {{ idx + 1 }}
              </td>
              <td class="border border-slate-300 p-2.5 font-bold text-slate-900">
                {{ item.itemName }}
              </td>
              <td class="border border-slate-300 p-2.5 text-center font-mono font-bold text-slate-700">
                {{ item.quantity }}
              </td>
              <td class="border border-slate-300 p-2.5 text-center text-slate-600 font-medium">
                {{ item.unit }}
              </td>
              <td class="border border-slate-300 p-2.5 text-right font-mono text-slate-600">
                Rp {{ item.pricePerUnit.toLocaleString('id-ID') }}
              </td>
              <td class="border border-slate-300 p-2.5 text-right font-mono font-extrabold text-amber-700">
                Rp {{ item.realization.toLocaleString('id-ID') }}
              </td>
              <td class="border border-slate-300 p-2.5 text-center font-mono text-slate-500">
                {{ item.notes?.split('|')[0] || '17/08/2026' }}
              </td>
              <td class="border border-slate-300 p-2.5 text-center">
                <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md uppercase border border-emerald-200">
                  {{ item.notes?.split('|')[1] || 'Terdata' }}
                </span>
              </td>
              <td class="border border-slate-300 p-2 text-center whitespace-nowrap space-x-1">
                <button
                  @click="openEditModal(item)"
                  class="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs"
                  title="Edit Item RAB via Modal"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button
                  @click="deleteRab(item.id)"
                  class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                  title="Hapus Item RAB"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-slate-900 text-white font-bold text-xs">
              <td colspan="4" class="p-3 text-right uppercase tracking-wider">TOTAL PENGELUARAN 2026:</td>
              <td class="p-3 text-right font-mono text-amber-300 font-black text-sm">
                Rp {{ totalRealization.toLocaleString('id-ID') }}
              </td>
              <td colspan="4" class="p-3 text-center text-xs text-emerald-300 font-mono">
                Sisa Uang Kas: Rp {{ balance.toLocaleString('id-ID') }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- DATA TABLE BY SECTION (NO PRINT SCREEN VIEW) -->
    <div v-else class="space-y-6 no-print">
      <div v-for="sec in filteredSections" :key="sec" class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div class="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="bi bi-diagram-3-fill text-indigo-600"></i>
            <h3 class="font-black text-sm text-slate-900 uppercase tracking-wide">
              {{ sec }}
            </h3>
          </div>
          <span class="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
            Total Seksi: Rp {{ getSectionRealization(sec).toLocaleString('id-ID') }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-white border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <th class="p-3.5 pl-6 w-12">No</th>
                <th class="p-3.5">Nama Item Barang / Jasa</th>
                <th class="p-3.5 text-center">Volume / Qty</th>
                <th class="p-3.5 text-right">Harga Satuan</th>
                <th class="p-3.5 text-right">Harga Total / Realisasi</th>
                <th class="p-3.5">Catatan Vendor</th>
                <th class="p-3.5 pr-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr v-for="(item, idx) in getItemsBySection(sec)" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 pl-6 text-slate-400 font-mono">{{ idx + 1 }}</td>
                <td class="p-3.5 font-bold text-slate-900 max-w-xs">{{ item.itemName }}</td>
                <td class="p-3.5 text-center font-mono font-bold text-slate-700">
                  {{ item.quantity }} {{ item.unit }}
                </td>
                <td class="p-3.5 text-right font-mono text-slate-600">
                  Rp {{ item.pricePerUnit.toLocaleString('id-ID') }}
                </td>
                <td class="p-3.5 text-right font-mono font-bold text-amber-600">
                  Rp {{ item.realization.toLocaleString('id-ID') }}
                </td>
                <td class="p-3.5 text-slate-500 text-[11px] max-w-xs">{{ item.notes || '-' }}</td>
                <td class="p-3.5 pr-6 text-center whitespace-nowrap space-x-1">
                  <button
                    @click="openEditModal(item)"
                    class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                    title="Edit Item RAB"
                  >
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    @click="deleteRab(item.id)"
                    class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                    title="Hapus Item RAB"
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- FORM MODAL (ADD / EDIT) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-scale-up">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-extrabold text-base text-slate-900">
            {{ isEditing ? 'Edit Item RAB' : 'Tambah Item RAB Baru' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveRab" class="space-y-4 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">Seksi / Divisi Panitia</label>
            <input
              v-model="form.section"
              type="text"
              placeholder="Contoh: Seksi Acara & Hadiah, Seksi Konsumsi"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Nama Barang / Jasa</label>
            <input
              v-model="form.itemName"
              type="text"
              placeholder="Contoh: Sewa Panggung Utama, Piala Set Juara"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Jumlah (Qty)</label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold focus:outline-none"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Satuan</label>
              <input
                v-model="form.unit"
                type="text"
                placeholder="Pcs/Box/Set"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Harga Satuan</label>
              <input
                v-model.number="form.pricePerUnit"
                type="number"
                min="0"
                step="1000"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-right font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Harga Total / Realisasi Terpakai</label>
            <input
              v-model.number="form.realization"
              type="number"
              min="0"
              step="500"
              required
              class="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl font-mono text-right font-bold focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Catatan / Vendor</label>
            <input
              v-model="form.notes"
              type="text"
              placeholder="Contoh: Pembelian di Toko Sembako Pak Supri"
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
              class="px-5 py-2 bg-indigo-600 text-white font-extrabold rounded-xl shadow-xs hover:bg-indigo-700"
            >
              Simpan Item RAB
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
              <i class="bi bi-file-earmark-pdf-fill text-indigo-600"></i>
               Pratinjau Dokumen Cetak A4 — Rencana Anggaran Biaya (RAB)
            </h3>
            <p class="text-xs text-slate-500">Lengkap dengan Kop Surat Resmi RT & Pengesahan Tanda Tangan</p>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="triggerPrint"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
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
            title="DOKUMEN RENCANA ANGGARAN BIAYA (RAB) PERINGATAN 17 AGUSTUS"
            subtitle="Rincian Alokasi Dana Per Seksi & Realisasi Pengeluaran Lapangan"
            docCode="RAB"
          >
            <!-- Summary Table Header -->
            <div class="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-center">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Pemasukan Dana 2026</span>
                <span class="font-black text-sm text-emerald-700 font-mono">Rp {{ totalIncome.toLocaleString('id-ID') }}</span>
              </div>
              <div class="text-center border-x border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Pengeluaran Realisasi</span>
                <span class="font-black text-sm text-rose-700 font-mono">Rp {{ totalExpense.toLocaleString('id-ID') }}</span>
              </div>
              <div class="text-center">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Sisa Uang (Kas)</span>
                <span class="font-black text-sm font-mono text-amber-700">
                  Rp {{ balance.toLocaleString('id-ID') }}
                </span>
              </div>
            </div>

            <!-- Print Data Table Grouped by Section -->
            <div class="space-y-5">
              <div v-for="sec in sectionsList" :key="sec" class="space-y-1">
                <h4 class="font-black text-xs text-slate-900 uppercase bg-slate-100 p-1.5 border-l-4 border-indigo-600">
                  {{ sec }}
                </h4>

                <table class="w-full border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr class="bg-slate-50 text-slate-800 font-bold uppercase text-[9px]">
                      <th class="border border-slate-300 p-1.5 text-center w-8">No</th>
                      <th class="border border-slate-300 p-1.5">Nama Barang / Jasa</th>
                      <th class="border border-slate-300 p-1.5 text-center w-20">Volume</th>
                      <th class="border border-slate-300 p-1.5 text-right w-24">Harga Satuan</th>
                      <th class="border border-slate-300 p-1.5 text-right w-28">Harga Total (Realisasi)</th>
                      <th class="border border-slate-300 p-1.5">Catatan Vendor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in getItemsBySection(sec)" :key="item.id">
                      <td class="border border-slate-300 p-1.5 text-center font-mono">{{ idx + 1 }}</td>
                      <td class="border border-slate-300 p-1.5 font-bold text-slate-900">{{ item.itemName }}</td>
                      <td class="border border-slate-300 p-1.5 text-center font-mono">{{ item.quantity }} {{ item.unit }}</td>
                      <td class="border border-slate-300 p-1.5 text-right font-mono">Rp {{ item.pricePerUnit.toLocaleString('id-ID') }}</td>
                      <td class="border border-slate-300 p-1.5 text-right font-mono font-bold text-amber-700">Rp {{ item.realization.toLocaleString('id-ID') }}</td>
                      <td class="border border-slate-300 p-1.5 text-slate-600">{{ item.notes || '-' }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-slate-50 font-bold text-slate-900">
                      <td colspan="4" class="border border-slate-300 p-1.5 text-right uppercase">Subtotal {{ sec }}:</td>
                      <td class="border border-slate-300 p-1.5 text-right font-mono text-amber-700">
                        Rp {{ getSectionRealization(sec).toLocaleString('id-ID') }}
                      </td>
                      <td class="border border-slate-300 p-1.5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Grand Total Footer Table -->
            <table class="w-full border-collapse border-2 border-slate-900 text-xs mt-6 font-bold">
              <tbody>
                <tr class="bg-slate-900 text-white">
                  <td class="p-2.5 uppercase">RANGKUMAN KEUANGAN KAS 17 AGUSTUS 2026:</td>
                  <td class="p-2.5 text-right font-mono text-emerald-300">Pemasukan: Rp {{ totalIncome.toLocaleString('id-ID') }}</td>
                  <td class="p-2.5 text-right font-mono text-amber-300">Pengeluaran: Rp {{ totalExpense.toLocaleString('id-ID') }}</td>
                  <td class="p-2.5 text-right font-mono text-cyan-300">Sisa Uang: Rp {{ balance.toLocaleString('id-ID') }}</td>
                </tr>
              </tbody>
            </table>

            <p class="text-[10px] text-slate-500 italic mt-4">
              * Dokumen RAB ini disahkan sebagai acuan resmi pengeluaran operasional panitia peringatan HUT RI ke-81.
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
import { RabItem } from '../types';
import { FIX_BOJONG_LIO_RAB_ITEMS, FIX_BOJONG_LIO_MONEY_TRANSACTIONS } from '../services/storage';
import OfficialPrintDocument from '../components/OfficialPrintDocument.vue';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

const store = useArenaStore();

function resetToDefaultData() {
  Swal.fire({
    title: 'Muat Ulang Data Belanjaan & Kas 2026?',
    text: 'Ini akan memuat ulang 26+ item list belanjaan & transaksi kas resmi 17 Agustus 2026.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: 'Ya, Muat Data',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      store.rabItems = JSON.parse(JSON.stringify(FIX_BOJONG_LIO_RAB_ITEMS));
      store.moneyTransactions = JSON.parse(JSON.stringify(FIX_BOJONG_LIO_MONEY_TRANSACTIONS));
      store.saveAll();
      Swal.fire({
        icon: 'success',
        title: 'Data Berhasil Dimuat!',
        text: 'Semua item list belanjaan & rangkuman kas 17 Agustus 2026 telah diperbarui.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

const searchQuery = ref('');
const selectedSection = ref<string>('ALL');

const isReadMode = ref(true); // Default to true if user opens readmode or imports
const excelFileInput = ref<HTMLInputElement | null>(null);

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref<string | null>(null);

const showPrintModal = ref(false);

function triggerExcelFileInput() {
  excelFileInput.value?.click();
}

function handleExcelImport(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  const file = files[0];

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (!rawJson || rawJson.length === 0) {
        Swal.fire('File Kosong', 'File Excel tidak berisi data.', 'warning');
        return;
      }

      const newRabItems: RabItem[] = [];
      let headerRowIndex = -1;
      let colMap: Record<string, number> = {};

      for (let r = 0; r < Math.min(10, rawJson.length); r++) {
        const row = rawJson[r];
        if (Array.isArray(row)) {
          const rowStr = row.map(cell => String(cell || '').toLowerCase()).join(' ');
          if (rowStr.includes('item') || rowStr.includes('nama') || rowStr.includes('harga') || rowStr.includes('qty')) {
            headerRowIndex = r;
            row.forEach((cell, colIdx) => {
              const c = String(cell || '').toLowerCase().trim();
              if (c.includes('nama') || c.includes('item') || c.includes('barang')) colMap['itemName'] = colIdx;
              else if (c.includes('qty') || c.includes('jumlah') || c.includes('vol')) colMap['quantity'] = colIdx;
              else if (c.includes('satuan')) colMap['unit'] = colIdx;
              else if (c.includes('estimasi') || c.includes('overall')) colMap['totalEstimated'] = colIdx;
              else if (c.includes('harga satuan') || c.includes('satuan')) colMap['pricePerUnit'] = colIdx;
              else if (c.includes('total') || c.includes('realisasi')) colMap['realization'] = colIdx;
              else if (c.includes('tanggal') || c.includes('date')) colMap['date'] = colIdx;
              else if (c.includes('status') || c.includes('catatan') || c.includes('info') || c.includes('notes')) colMap['notes'] = colIdx;
            });
            break;
          }
        }
      }

      const startDataRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;

      for (let i = startDataRow; i < rawJson.length; i++) {
        const row = rawJson[i];
        if (!row || !Array.isArray(row) || row.length === 0) continue;

        const itemName = String(
          colMap['itemName'] !== undefined ? row[colMap['itemName']] : (row[1] || row[0] || '')
        ).trim();

        if (!itemName || itemName.toLowerCase().includes('total') || itemName.toLowerCase().includes('subtotal') || itemName.toLowerCase().includes('nama item') || itemName.toLowerCase() === 'item') {
          continue;
        }

        const qty = Number(colMap['quantity'] !== undefined ? row[colMap['quantity']] : row[2]) || 1;
        const unit = String(colMap['unit'] !== undefined ? row[colMap['unit']] : row[3] || 'Pcs').trim();
        const pricePerUnit = Number(colMap['pricePerUnit'] !== undefined ? row[colMap['pricePerUnit']] : row[5] || row[4]) || 0;
        const totalEstimated = Number(colMap['totalEstimated'] !== undefined ? row[colMap['totalEstimated']] : row[4] || row[6]) || (qty * pricePerUnit);
        const realization = Number(colMap['realization'] !== undefined ? row[colMap['realization']] : row[6] || totalEstimated) || totalEstimated;
        const dateStr = String(colMap['date'] !== undefined ? row[colMap['date']] : row[7] || '').trim();
        const statusNotes = String(colMap['notes'] !== undefined ? row[colMap['notes']] : row[8] || '').trim();

        newRabItems.push({
          id: 'rab-' + uuidv4().substring(0, 8),
          section: 'Hasil Import Excel Anggaran',
          itemName,
          quantity: qty,
          unit: unit || 'Pcs',
          pricePerUnit: pricePerUnit || (qty > 0 ? Math.round(totalEstimated / qty) : totalEstimated),
          totalEstimated: totalEstimated || (qty * pricePerUnit),
          realization: realization || totalEstimated,
          notes: [dateStr, statusNotes].filter(Boolean).join(' | ') || 'Terdata via Excel'
        });
      }

      if (newRabItems.length > 0) {
        store.rabItems = newRabItems;
        store.saveAll();
        isReadMode.value = true; // DIRECT READMODE!

        Swal.fire({
          icon: 'success',
          title: 'Import Excel Transaksi Anggaran Berhasil!',
          text: `Berhasil mengimpor ${newRabItems.length} baris transaksi dan langsung aktif dalam Read Mode Excel.`,
          confirmButtonColor: '#059669'
        });
      } else {
        Swal.fire('Peringatan', 'Tidak ada data transaksi valid yang dapat dibaca.', 'warning');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error Import', 'Gagal memproses file Excel.', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
  (e.target as HTMLInputElement).value = '';
}

function exportToExcel() {
  const exportData = store.rabItems.map((item, idx) => ({
    'No': idx + 1,
    'Nama Item': item.itemName,
    'Qty': item.quantity,
    'Satuan Barang': item.unit,
    'Estimasi Harga': item.totalEstimated,
    'Harga Satuan': item.pricePerUnit,
    'Harga Total': item.realization,
    'Tanggal': item.notes?.split('|')[0] || '17/08/2026',
    'Status': item.notes?.split('|')[1] || 'Terdata'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi Anggaran');
  XLSX.writeFile(workbook, `Transaksi_Anggaran_17Agustus_2026.xlsx`);
}

const form = ref({
  section: 'Seksi Acara & Hadiah',
  itemName: '',
  quantity: 1,
  unit: 'Set',
  pricePerUnit: 100000,
  realization: 100000,
  notes: ''
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

const balance = computed(() => totalIncome.value - totalExpense.value);

const totalEstimatedBudget = computed(() => {
  return store.rabItems.reduce((sum, item) => sum + (item.totalEstimated || 0), 0);
});

const totalRealization = computed(() => {
  return store.rabItems.reduce((sum, item) => sum + (item.realization || 0), 0);
});

const variance = computed(() => totalEstimatedBudget.value - totalRealization.value);

const sectionsList = computed(() => {
  const set = new Set<string>();
  store.rabItems.forEach(item => {
    if (item.section) set.add(item.section);
  });
  return Array.from(set);
});

const filteredSections = computed(() => {
  if (selectedSection.value !== 'ALL') {
    return [selectedSection.value];
  }
  return sectionsList.value;
});

function getItemsBySection(sec: string) {
  return store.rabItems.filter(item => {
    const matchesSec = item.section === sec;
    const matchesSearch = !searchQuery.value ||
      item.itemName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchesSec && matchesSearch;
  });
}

function getSectionTotal(sec: string) {
  return store.rabItems
    .filter(i => i.section === sec)
    .reduce((sum, i) => sum + (i.totalEstimated || 0), 0);
}

function getSectionRealization(sec: string) {
  return store.rabItems
    .filter(i => i.section === sec)
    .reduce((sum, i) => sum + (i.realization || 0), 0);
}

function openAddModal() {
  isEditing.value = false;
  editId.value = null;
  form.value = {
    section: 'Seksi Acara & Hadiah',
    itemName: '',
    quantity: 1,
    unit: 'Set',
    pricePerUnit: 150000,
    realization: 150000,
    notes: ''
  };
  showModal.value = true;
}

function openEditModal(item: RabItem) {
  isEditing.value = true;
  editId.value = item.id;
  form.value = {
    section: item.section,
    itemName: item.itemName,
    quantity: item.quantity,
    unit: item.unit,
    pricePerUnit: item.pricePerUnit,
    realization: item.realization,
    notes: item.notes || ''
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveRab() {
  if (isEditing.value && editId.value) {
    store.updateRabItem(editId.value, { ...form.value });
    Swal.fire({
      icon: 'success',
      title: 'Item RAB Diperbarui!',
      timer: 1200,
      showConfirmButton: false
    });
  } else {
    store.addRabItem({ ...form.value });
    Swal.fire({
      icon: 'success',
      title: 'Item RAB Ditambahkan!',
      timer: 1200,
      showConfirmButton: false
    });
  }
  closeModal();
}

function deleteRab(id: string) {
  Swal.fire({
    title: 'Hapus Item RAB Ini?',
    text: 'Item anggaran ini akan dihapus dari RAB.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      store.deleteRabItem(id);
      Swal.fire({
        icon: 'success',
        title: 'Item Dihapus',
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
