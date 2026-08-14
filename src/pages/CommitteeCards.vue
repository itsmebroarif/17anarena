<template>
  <div class="space-y-6 animate-fade-in pb-12">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider border border-red-200">
            Official ID Badge
          </span>
          <span class="text-xs text-slate-400 font-mono font-bold">PANITIA HUT RI</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <i class="bi bi-person-badge-fill text-red-600"></i>
          <span>Manajemen Panitia & ID Card</span>
        </h1>
        <p class="text-xs text-slate-500">
          Kelola struktur panitia, impor massal (bulk), dan cetak ID Card resmi dilengkapi QR Code verifikasi.
        </p>
      </div>

      <!-- Header Quick Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="isPaperModalOpen = true"
          class="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
          title="Buka Form Kertas Catatan Lapangan & Bracket Shaker Tim per Lomba"
        >
          <i class="bi bi-clipboard2-check-fill text-amber-200 text-sm"></i>
          <span>📝 Form Kertas Lomba & Bracket Shaker</span>
        </button>

        <button
          @click="isMcWaOpen = true"
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
          title="Kirim instruksi, panggilan, atau pengumuman ke MC"
        >
          <i class="bi bi-mic-fill text-amber-300 text-sm"></i>
          <span>🎤 Kirim WA ke MC</span>
        </button>

        <button
          @click="isBulkModalOpen = true"
          class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
        >
          <i class="bi bi-file-earmark-plus-fill text-amber-400 text-sm"></i>
          <span>Bulk Edit / Import</span>
        </button>

        <button
          @click="isSingleModalOpen = true"
          class="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
        >
          <i class="bi bi-person-plus-fill text-sm"></i>
          <span>+ Tambah Panitia</span>
        </button>

        <button
          @click="openBulkPrintModal"
          class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
          :disabled="store.committees.length === 0"
        >
          <i class="bi bi-printer-fill text-sm"></i>
          <span>Cetak Banyak (A4)</span>
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl font-black">
          <i class="bi bi-people-fill"></i>
        </div>
        <div>
          <span class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Panitia</span>
          <span class="text-2xl font-black text-slate-900">{{ store.committees.length }}</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-black">
            <i class="bi bi-mic-fill"></i>
          </div>
          <div>
            <span class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Kontak WA MC</span>
            <span class="text-xs font-mono font-black text-slate-900 block">
              {{ store.settings.mcPhoneNumber || '(Belum Diatur)' }}
            </span>
          </div>
        </div>
        <button
          @click="isMcWaOpen = true"
          class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-200"
          title="Atur & Kirim WA ke MC"
        >
          <i class="bi bi-whatsapp text-sm"></i>
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-black">
            <i class="bi bi-person-badge-fill"></i>
          </div>
          <div>
            <span class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Ketua Utama</span>
            <span
              class="text-sm font-black text-slate-900 truncate max-w-[130px] block"
              :class="{ 'text-slate-400 font-semibold italic': !mainRoleTitle }"
            >
              {{ mainRoleTitle || '(Belum Diisi)' }}
            </span>
          </div>
        </div>
        <button
          @click="openKetuaModal"
          class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors border border-transparent hover:border-amber-200"
          title="Atur / Edit Nama Ketua Utama"
        >
          <i class="bi bi-pencil-square text-sm"></i>
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-black">
          <i class="bi bi-person-workspace"></i>
        </div>
        <div>
          <span class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Jumlah Seksi</span>
          <span class="text-2xl font-black text-slate-900">{{ uniqueSectionsCount }}</span>
        </div>
      </div>
    </div>


    <!-- Filter & View Mode Switcher -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Search input -->
      <div class="relative w-full sm:w-80">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-sm"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama, peran, seksi, atau No. ID..."
          class="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
        />
      </div>

      <!-- Section Filter & View Toggle -->
      <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <select
          v-model="selectedRoleFilter"
          class="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="">-- Semua Peran Panitia --</option>
          <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
        </select>

        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            @click="activeView = 'cards'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            :class="activeView === 'cards' ? 'bg-white text-red-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'"
          >
            <i class="bi bi-grid-fill"></i>
            <span>Visual Cards</span>
          </button>
          <button
            @click="activeView = 'table'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            :class="activeView === 'table' ? 'bg-white text-red-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'"
          >
            <i class="bi bi-list-task"></i>
            <span>Tabel Data</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCommittees.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
      <div class="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl">
        <i class="bi bi-person-badge"></i>
      </div>
      <h3 class="text-base font-extrabold text-slate-900">Belum Ada Data Panitia</h3>
      <p class="text-xs text-slate-400 max-w-sm mx-auto">
        Tambahkan anggota panitia satu per satu atau gunakan fitur Bulk Import untuk memasukkan banyak data sekaligus.
      </p>
      <div class="pt-2 flex justify-center gap-2">
        <button
          @click="isBulkModalOpen = true"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
        >
          <i class="bi bi-file-earmark-plus mr-1"></i> Bulk Import
        </button>
        <button
          @click="isSingleModalOpen = true"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
        >
          <i class="bi bi-plus-lg mr-1"></i> Tambah Manual
        </button>
      </div>
    </div>

    <!-- VIEW 1: VISUAL ID CARDS GRID -->
    <div v-else-if="activeView === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="member in filteredCommittees"
        :key="member.id"
        class="bg-white rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col relative group"
      >
        <!-- Top Banner -->
        <div class="bg-red-700 text-white py-1.5 px-3 text-center text-[10px] font-mono font-bold flex items-center justify-between border-b border-red-800">
          <span class="flex items-center gap-1 text-white">
            <i class="bi bi-flag-fill"></i> HUT RI KE-81
          </span>
          <span class="bg-white text-red-700 px-1.5 py-0.2 rounded font-extrabold">OFFICIAL</span>
        </div>

        <!-- Merah Putih Banner -->
        <div class="h-16 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 relative p-3 flex justify-between items-start">
          <div class="text-white">
            <span class="block text-[9px] font-bold uppercase tracking-widest text-red-100">KARTU TANDA PANITIA</span>
            <span class="font-black text-xs uppercase">{{ member.section || 'PANITIA HUT RI' }}</span>
          </div>
          <span class="text-white font-mono text-[11px] font-extrabold bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
            {{ member.idCardNumber }}
          </span>
        </div>

        <!-- Avatar & Member Info -->
        <div class="p-4 pt-0 text-center flex-1 flex flex-col justify-between -mt-8">
          <div>
            <!-- Photo/Avatar Circle -->
            <div class="w-16 h-16 rounded-full bg-slate-100 text-red-600 font-extrabold text-xl flex items-center justify-center border-4 border-white shadow-md mx-auto mb-2 relative">
              <span>{{ getInitials(member.name) }}</span>
              <span class="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <h3 class="font-extrabold text-base text-slate-900 leading-snug">
              {{ member.name }}
            </h3>

            <div class="mt-1">
              <span class="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 font-extrabold text-xs border border-red-200">
                {{ member.role }}
              </span>
            </div>

            <div class="mt-3 text-[11px] text-slate-500 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left">
              <p class="flex items-center justify-between">
                <span class="text-slate-400">No. WhatsApp:</span>
                <a v-if="member.phone && member.phone !== '-'" :href="generateWaLink(member.phone, 'Halo ' + member.name)" target="_blank" class="text-emerald-600 hover:underline font-mono font-bold flex items-center gap-1">
                  <i class="bi bi-whatsapp text-xs"></i>
                  <span>{{ member.phone }}</span>
                </a>
                <span v-else class="text-slate-400 italic">Belum ada</span>
              </p>
              <p class="flex items-center justify-between">
                <span class="text-slate-400">Email:</span>
                <a v-if="member.email" :href="'mailto:' + member.email" class="text-blue-600 hover:underline font-bold truncate max-w-[130px]" :title="member.email">
                  {{ member.email }}
                </a>
                <span v-else class="text-slate-400 italic">Belum ada</span>
              </p>
              <p class="flex items-center justify-between">
                <span class="text-slate-400">RT / RW:</span>
                <strong class="text-slate-800">{{ member.rtRw || '-' }}</strong>
              </p>
            </div>
          </div>

          <!-- Bottom QR & Sign -->
          <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <div class="text-left">
              <span class="block text-[8px] uppercase text-slate-400 font-extrabold">Verifikasi Panitia</span>
              <span class="text-[9px] font-mono text-emerald-600 font-bold">✓ VALIDATED</span>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1">
              <button
                @click="editMember(member)"
                class="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs"
                title="Edit Data"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button
                @click="deleteMember(member)"
                class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs"
                title="Hapus"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: DATA TABLE -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
              <th class="p-3 text-center w-12">#</th>
              <th class="p-3">ID Card No.</th>
              <th class="p-3">Nama Lengkap</th>
              <th class="p-3">Peran / Jabatan</th>
              <th class="p-3">Seksi / Divisi</th>
              <th class="p-3">No. WhatsApp</th>
              <th class="p-3">Email</th>
              <th class="p-3">RT / RW</th>
              <th class="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-800">
            <tr
              v-for="(m, idx) in filteredCommittees"
              :key="m.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="p-3 text-center font-mono text-slate-400 text-xs font-bold">{{ idx + 1 }}</td>
              <td class="p-3 font-mono font-bold text-red-600">{{ m.idCardNumber }}</td>
              <td class="p-3 font-extrabold text-slate-900">{{ m.name }}</td>
              <td class="p-3">
                <span class="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-extrabold text-[10px] border border-red-200">
                  {{ m.role }}
                </span>
              </td>
              <td class="p-3 text-slate-600">{{ m.section || '-' }}</td>
              <td class="p-3 font-mono text-emerald-600 font-bold">
                <a v-if="m.phone && m.phone !== '-'" :href="generateWaLink(m.phone, 'Halo ' + m.name)" target="_blank" class="hover:underline flex items-center gap-1">
                  <i class="bi bi-whatsapp"></i>
                  <span>{{ m.phone }}</span>
                </a>
                <span v-else class="text-slate-400 text-[11px]">-</span>
              </td>
              <td class="p-3 text-blue-600 font-semibold">
                <a v-if="m.email" :href="'mailto:' + m.email" class="hover:underline">
                  {{ m.email }}
                </a>
                <span v-else class="text-slate-400 text-[11px]">-</span>
              </td>
              <td class="p-3 text-slate-600">{{ m.rtRw || '-' }}</td>
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="editMember(m)"
                    class="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    @click="deleteMember(m)"
                    class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL 0: EDIT KETUA UTAMA -->
    <div
      v-if="isKetuaModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      @click.self="isKetuaModalOpen = false"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-2">
            <i class="bi bi-person-badge-fill text-amber-500 text-lg"></i>
            <h3 class="font-extrabold text-sm text-slate-900">Atur Ketua Utama Panitia</h3>
          </div>
          <button @click="isKetuaModalOpen = false" class="text-slate-400 hover:text-slate-800">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <form @submit.prevent="saveKetuaUtama" class="p-5 space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Ketua Utama / Panitia *</label>
            <input
              v-model="ketuaInputName"
              required
              type="text"
              placeholder="Masukkan nama lengkap Ketua Utama"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:border-red-500 text-xs"
            />
            <p class="text-[11px] text-slate-500 mt-1">
              Nama ini akan disimpan sebagai Ketua Panitia resmi di Pengaturan Aplikasi & Sertifikat.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              @click="isKetuaModalOpen = false"
              class="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              Simpan Ketua
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 1: BULK IMPORT / BULK EDIT DATA PANITIA -->
    <div
      v-if="isBulkModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
      @click.self="isBulkModalOpen = false"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shadow-xs">
          <div class="flex items-center gap-2">
            <i class="bi bi-file-earmark-text-fill text-amber-400 text-xl"></i>
            <div>
              <h3 class="font-extrabold text-sm">Bulk Fill & Edit Susunan Panitia</h3>
              <p class="text-[11px] text-slate-400">Isi atau edit massal susunan panitia dalam format sederhana: <strong>nama, jabatan</strong></p>
            </div>
          </div>
          <button @click="isBulkModalOpen = false" class="text-slate-400 hover:text-white">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Format Guide Banner -->
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-2">
            <div class="font-extrabold flex items-center gap-1.5 text-amber-900">
              <i class="bi bi-info-circle-fill text-amber-600 text-sm"></i>
              <span>Format Teks Per Baris: <strong>nama, jabatan</strong></span>
            </div>
            <code class="block font-mono bg-white p-2.5 rounded-xl border border-amber-200 text-[11px] leading-relaxed">
              Ahmad Subardjo, Ketua Panitia<br>
              Rina Marlina, MC / Pembawa Acara<br>
              Budi Santoso, Seksi Perlengkapan<br>
              Siti Rahma, Seksi Konsumsi
            </code>
            <p class="text-[10px] text-slate-600">
              *Opsional: Anda juga dapat memasukkan kolom tambahan: <code>Nama, Jabatan, Seksi, No WA, RT/RW</code>.
            </p>
          </div>

          <!-- Mode Selection & Quick Actions -->
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <label class="font-extrabold text-slate-700">Mode Simpan Bulk:</label>
              <div class="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <label class="flex items-center gap-1.5 cursor-pointer font-bold px-2 py-1 rounded-lg" :class="bulkImportMode === 'append' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-600'">
                  <input type="radio" v-model="bulkImportMode" value="append" class="hidden" />
                  <span>+ Tambahkan ke Data Ada</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer font-bold px-2 py-1 rounded-lg" :class="bulkImportMode === 'replace' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-600'">
                  <input type="radio" v-model="bulkImportMode" value="replace" class="hidden" />
                  <span>⚠️ Timpa / Ganti Seluruh Data</span>
                </label>
              </div>
            </div>

            <!-- Toolbar Buttons -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div class="flex items-center gap-2">
                <button
                  @click="loadCurrentCommitteeToText"
                  class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 text-[11px] flex items-center gap-1"
                  title="Muat data panitia yang ada sekarang ke dalam box teks"
                >
                  <i class="bi bi-box-arrow-in-down text-blue-600"></i>
                  <span>Muat Susunan Saat Ini</span>
                </button>
                <button
                  @click="copyCurrentCommitteeFormat"
                  class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 text-[11px] flex items-center gap-1"
                  title="Salin daftar panitia dengan format Nama, Jabatan"
                >
                  <i class="bi bi-clipboard-check text-emerald-600"></i>
                  <span>Salin Format (Nama, Jabatan)</span>
                </button>
              </div>

              <button
                @click="loadSampleBulkData"
                class="text-[11px] text-red-600 hover:underline font-extrabold flex items-center gap-1"
              >
                <i class="bi bi-magic"></i>
                <span>+ Muat Contoh Data</span>
              </button>
            </div>

            <textarea
              v-model="bulkInputText"
              rows="8"
              placeholder="Ahmad Subardjo, Ketua Panitia&#10;Rina Marlina, MC / Pembawa Acara&#10;Budi Santoso, Seksi Perlengkapan&#10;Siti Rahma, Seksi Konsumsi"
              class="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <span class="text-[11px] text-slate-500 font-medium">
            Total Baris Teks: <strong>{{ bulkInputText.trim() ? bulkInputText.trim().split('\n').filter(Boolean).length : 0 }}</strong>
          </span>

          <div class="flex items-center gap-2">
            <button
              @click="isBulkModalOpen = false"
              class="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300"
            >
              Batal
            </button>
            <button
              @click="processBulkImport"
              class="px-5 py-2 bg-red-600 text-white font-extrabold text-xs rounded-xl hover:bg-red-700 shadow-md flex items-center gap-1.5"
            >
              <i class="bi bi-check-circle-fill"></i>
              <span>Simpan Susunan Panitia</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 2: SINGLE MEMBER FORM -->
    <div
      v-if="isSingleModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      @click.self="closeSingleModal"
    >
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
          <h3 class="font-extrabold text-sm text-slate-900">
            {{ editingId ? 'Edit Data Panitia' : 'Tambah Panitia Baru' }}
          </h3>
          <button @click="closeSingleModal" class="text-slate-400 hover:text-slate-800">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveSingleMember" class="p-5 space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
            <input
              v-model="singleForm.name"
              required
              type="text"
              placeholder="E.g. Ir. Budi Subekti"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-red-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Peran / Jabatan *</label>
              <select
                v-model="singleForm.role"
                required
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-red-500"
              >
                <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Seksi / Divisi</label>
              <input
                v-model="singleForm.section"
                type="text"
                placeholder="E.g. Panitia Utama"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">No. WhatsApp</label>
              <input
                v-model="singleForm.phone"
                type="tel"
                placeholder="0812xxxxxxxx"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Email Panitia</label>
              <input
                v-model="singleForm.email"
                type="email"
                placeholder="panitia@gmail.com"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">RT / RW</label>
              <input
                v-model="singleForm.rtRw"
                type="text"
                placeholder="RT 02/RW 05"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-red-500"
              />
            </div>

            <div class="flex items-center pt-5">
              <label class="flex items-center gap-2 cursor-pointer text-slate-800 font-bold">
                <input
                  type="checkbox"
                  v-model="singleForm.isOfficialMc"
                  class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span class="text-[11px] text-emerald-700">🎤 Set Kontak WA MC Event Ini</span>
              </label>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              @click="closeSingleModal"
              class="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white font-extrabold text-xs rounded-xl hover:bg-red-700 shadow-md"
            >
              Simpan Panitia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 3: BULK PRINT ID CARDS PAGE (A4 SHEET PRINT LAYOUT) -->
    <div
      v-if="isPrintModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto"
    >
      <div class="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8 flex flex-col">
        <!-- Print Modal Header -->
        <div class="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div class="flex items-center gap-2">
            <i class="bi bi-printer-fill text-emerald-400 text-xl"></i>
            <div>
              <h3 class="font-extrabold text-sm">Preview Cetak ID Card Panitia (Standard A4 Grid)</h3>
              <p class="text-[11px] text-slate-400">Layout 8 ID Card per lembar A4 siap dipotong</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="triggerBrowserPrint"
              class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <i class="bi bi-printer"></i>
              <span>Cetak Sekarang (Print)</span>
            </button>
            <button
              @click="isPrintModalOpen = false"
              class="p-1.5 text-slate-400 hover:text-white"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Printable Canvas Area -->
        <div class="p-8 bg-slate-200 overflow-y-auto max-h-[80vh] flex justify-center">
          <!-- A4 Page Container -->
          <div id="a4-printable-grid" class="w-[210mm] min-h-[297mm] bg-white p-[10mm] shadow-2xl grid grid-cols-2 gap-4 border border-slate-300">
            <div
              v-for="m in filteredCommittees"
              :key="m.id"
              class="border-2 border-slate-900 rounded-xl overflow-hidden bg-white text-slate-900 flex flex-col justify-between h-[85mm] relative shadow-xs"
            >
              <!-- Lanyard Notch Area -->
              <div class="bg-slate-900 text-white py-1 text-center text-[8px] font-mono font-bold uppercase tracking-wider flex items-center justify-between px-2">
                <span>PANITIA HUT RI-81</span>
                <span>OFFICIAL ID BADGE</span>
              </div>

              <!-- Top Merah Putih Banner -->
              <div class="bg-gradient-to-r from-red-600 to-rose-700 p-2 text-white flex items-center justify-between">
                <div>
                  <h4 class="font-black text-xs uppercase leading-tight">{{ store.settings.eventName }}</h4>
                  <span class="text-[8px] opacity-90 block font-mono">SEKSI: {{ m.section || 'PANITIA PELAKSANA' }}</span>
                </div>
                <span class="font-mono text-[9px] bg-black/40 px-1.5 py-0.5 rounded font-extrabold">
                  {{ m.idCardNumber }}
                </span>
              </div>

              <!-- Main Body -->
              <div class="p-3 text-center flex-1 flex flex-col justify-center items-center">
                <div class="w-12 h-12 rounded-full bg-slate-900 text-amber-400 font-extrabold text-lg flex items-center justify-center border-2 border-red-600 mb-1">
                  {{ getInitials(m.name) }}
                </div>
                <h3 class="font-black text-sm text-slate-900 uppercase leading-snug">{{ m.name }}</h3>
                <span class="inline-block mt-1 px-3 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase">
                  {{ m.role }}
                </span>
                <p class="text-[9px] text-slate-500 font-medium mt-1">Wilayah: {{ m.rtRw || 'RT/RW General' }}</p>
              </div>

              <!-- Card Footer -->
              <div class="bg-slate-100 p-2 border-t border-slate-300 flex items-center justify-between text-[8px]">
                <div class="text-left font-mono text-slate-600">
                  <span>Panitia Resmi HUT RI</span>
                </div>
                <div class="text-right font-mono font-bold text-emerald-700">
                  ✓ VERIFIED BADGE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MC WHATSAPP MODAL -->
    <McWaModal :isOpen="isMcWaOpen" @close="isMcWaOpen = false" />

    <!-- FORM KERTAS LOMBA & BRACKET SHAKER MODAL -->
    <CompetitionScorePaperModal :isOpen="isPaperModalOpen" @close="isPaperModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { CommitteeMember } from '../types';
import { generateWaLink } from '../services/whatsapp';
import McWaModal from '../components/McWaModal.vue';
import CompetitionScorePaperModal from '../components/CompetitionScorePaperModal.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();

const searchQuery = ref('');
const selectedRoleFilter = ref('');
const activeView = ref<'cards' | 'table'>('cards');

const isBulkModalOpen = ref(false);
const isSingleModalOpen = ref(false);
const isPrintModalOpen = ref(false);
const isKetuaModalOpen = ref(false);
const isMcWaOpen = ref(false);
const isPaperModalOpen = ref(false);

const bulkInputText = ref('');
const bulkImportMode = ref<'append' | 'replace'>('append');
const ketuaInputName = ref('');
const editingId = ref<string | null>(null);

const singleForm = ref({
  name: '',
  role: 'Seksi Acara',
  section: 'Internal',
  phone: '',
  email: '',
  rtRw: '',
  isOfficialMc: false
});

const roleOptions = [
  'Direktur Acara',
  'Ketua Pelaksana',
  'Ketua Panitia',
  'Finance Analyst',
  'System Analyst',
  'SPV Registrasi',
  'Anggota Registrasi',
  'SPV Pengamat Acara & Pencatat Skor',
  'Pengamat Acara',
  'Pencatat Juara Lomba',
  'MC / Host',
  'SPV Keamanan Acara',
  'Dokumentasi',
  'Asset Management',
  'Seksi Acara',
  'Seksi Perlengkapan',
  'Seksi Konsumsi',
  'Juri Lomba'
];

const filteredCommittees = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const rf = selectedRoleFilter.value;

  return store.committees.filter(m => {
    const matchQuery = !q || (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.section.toLowerCase().includes(q) ||
      m.idCardNumber.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      m.phone.includes(q)
    );
    const matchRole = !rf || m.role === rf;
    return matchQuery && matchRole;
  });
});

const uniqueSectionsCount = computed(() => {
  const sections = new Set(store.committees.map(m => m.section).filter(Boolean));
  return sections.size || 1;
});

const mainRoleTitle = computed(() => {
  const ketua = store.committees.find(m => m.role.toLowerCase().includes('ketua'));
  if (ketua) return ketua.name;
  if (store.settings.headOfCommittee) return store.settings.headOfCommittee;
  return '';
});

function openKetuaModal() {
  ketuaInputName.value = mainRoleTitle.value || '';
  isKetuaModalOpen.value = true;
}

function saveKetuaUtama() {
  const name = ketuaInputName.value.trim();
  if (!name) return;

  store.settings.headOfCommittee = name;

  const existingKetua = store.committees.find(m => m.role.toLowerCase().includes('ketua'));
  if (existingKetua) {
    existingKetua.name = name;
  } else {
    store.addCommitteeMember({
      name: name,
      role: 'Ketua Panitia',
      section: 'Panitia Utama',
      phone: '',
      email: '',
      rtRw: ''
    });
  }

  store.saveAll();
  store.logActivity('Ketua Utama Diperbarui', `Nama Ketua Utama diatur menjadi "${name}".`);
  isKetuaModalOpen.value = false;
}

function getInitials(name: string) {
  if (!name) return 'P';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function loadSampleBulkData() {
  bulkInputText.value = `1\tPak Bambang (RT)\tDirektur Acara\tInternal
2\tArif Permana\tKetua Pelaksana\tInternal
3\tNaufal Daffa\tKetua Panitia\tInternal
4\tAlda Emiliana\tFinance Analyst\tExternal Team
5\tDzaki Ahnaf Zulfikar\tSystem Analyst\tExternal Team
6\tArif Permana\tSPV Registrasi\tInternal
7\tAulia\tAnggota Registrasi\tInternal
8\tSalwa\tSPV Pengamat Acara & Pencatat Skor\tInternal
9\tDilla\tPengamat Acara\tInternal
10\tAqila\tPencatat Juara Lomba\tInternal
11\tKevin\tMC / Host\tInternal\tkevin.mc@gmail.com\t081234567890
12\tAbi\tSPV Keamanan Acara\tInternal
13\tNaufal Daffa\tDokumentasi\tInternal
14\tArio Wicaksono\tAsset Management\tInternal`;
}

function loadCurrentCommitteeToText() {
  if (store.committees.length === 0) {
    bulkInputText.value = '';
    return;
  }
  bulkInputText.value = store.committees.map((m, idx) => {
    return `${idx + 1}\t${m.name}\t${m.role}\t${m.section || 'Internal'}\t${m.phone || ''}\t${m.email || ''}\t${m.rtRw || ''}`.trim();
  }).join('\n');
}

function copyCurrentCommitteeFormat() {
  if (store.committees.length === 0) {
    Swal.fire({ icon: 'info', title: 'Data Kosong', text: 'Belum ada data panitia untuk disalin.' });
    return;
  }
  const text = store.committees.map(m => `${m.name}, ${m.role}`).join('\n');
  navigator.clipboard.writeText(text);
  Swal.fire({
    icon: 'success',
    title: 'Format Disalin!',
    text: `Berhasil menyalin ${store.committees.length} susunan panitia (Nama, Jabatan) ke clipboard.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function processBulkImport() {
  if (!bulkInputText.value.trim()) return;

  const lines = bulkInputText.value.trim().split('\n');
  const membersToAdd: { name: string; role?: string; section?: string; phone?: string; email?: string; rtRw?: string }[] = [];

  lines.forEach(line => {
    if (!line.trim()) return;
    const delimiter = line.includes('\t') ? '\t' : ',';
    let parts = line.split(delimiter).map(s => s.trim());

    if (parts.length > 1 && /^\d+\.?$/.test(parts[0])) {
      parts.shift();
    }

    if (parts.length > 0 && parts[0]) {
      let name = parts[0];
      let role = parts[1] || 'Anggota Panitia';
      let section = parts[2] || 'Internal';
      let phone = '';
      let email = '';
      let rtRw = '';

      for (let i = 3; i < parts.length; i++) {
        const val = parts[i];
        if (val.includes('@')) {
          email = val;
        } else if (/^[0-9+-\s]{7,15}$/.test(val)) {
          phone = val;
        } else if (val.toLowerCase().includes('rt') || val.toLowerCase().includes('rw')) {
          rtRw = val;
        }
      }

      if (!phone && parts[3] && !parts[3].includes('@')) phone = parts[3];
      if (!email && parts[4] && parts[4].includes('@')) email = parts[4];
      if (!rtRw && parts[5]) rtRw = parts[5];

      membersToAdd.push({
        name,
        role,
        section,
        phone,
        email,
        rtRw
      });
    }
  });

  if (membersToAdd.length > 0) {
    store.bulkAddCommitteeMembers(membersToAdd, bulkImportMode.value);
    bulkInputText.value = '';
    isBulkModalOpen.value = false;

    const mcMember = membersToAdd.find(m =>
      m.role?.toLowerCase().includes('mc') ||
      m.role?.toLowerCase().includes('host') ||
      m.role?.toLowerCase().includes('pembawa acara')
    );
    if (mcMember && mcMember.phone && mcMember.phone !== '-' && !store.settings.mcPhoneNumber) {
      store.updateSettings({ mcPhoneNumber: mcMember.phone });
    }

    Swal.fire({
      icon: 'success',
      title: 'Susunan Panitia Diperbarui!',
      text: `Berhasil ${bulkImportMode.value === 'replace' ? 'mengganti seluruh' : 'menambahkan'} ${membersToAdd.length} data panitia.`,
      timer: 1800,
      showConfirmButton: false
    });
  }
}

function closeSingleModal() {
  isSingleModalOpen.value = false;
  editingId.value = null;
  singleForm.value = {
    name: '',
    role: 'Seksi Acara',
    section: 'Internal',
    phone: '',
    email: '',
    rtRw: '',
    isOfficialMc: false
  };
}

function editMember(m: CommitteeMember) {
  editingId.value = m.id;
  singleForm.value = {
    name: m.name,
    role: m.role,
    section: m.section,
    phone: m.phone || '',
    email: m.email || '',
    rtRw: m.rtRw || '',
    isOfficialMc: store.settings.mcPhoneNumber === m.phone && !!m.phone
  };
  isSingleModalOpen.value = true;
}

function saveSingleMember() {
  if (!singleForm.value.name) return;

  if (editingId.value) {
    store.updateCommitteeMember(editingId.value, {
      name: singleForm.value.name,
      role: singleForm.value.role,
      section: singleForm.value.section,
      phone: singleForm.value.phone,
      email: singleForm.value.email,
      rtRw: singleForm.value.rtRw
    });
  } else {
    store.addCommitteeMember({
      name: singleForm.value.name,
      role: singleForm.value.role,
      section: singleForm.value.section,
      phone: singleForm.value.phone,
      email: singleForm.value.email,
      rtRw: singleForm.value.rtRw
    });
  }

  if (singleForm.value.isOfficialMc && singleForm.value.phone) {
    store.updateSettings({ mcPhoneNumber: singleForm.value.phone });
  } else if (
    (singleForm.value.role.toLowerCase().includes('mc') || singleForm.value.role.toLowerCase().includes('host') || singleForm.value.role.toLowerCase().includes('pembawa acara')) &&
    singleForm.value.phone &&
    !store.settings.mcPhoneNumber
  ) {
    store.updateSettings({ mcPhoneNumber: singleForm.value.phone });
  }

  closeSingleModal();
}

function deleteMember(m: CommitteeMember) {
  if (confirm(`Yakin ingin menghapus panitia "${m.name}"?`)) {
    store.deleteCommitteeMember(m.id);
  }
}

function openBulkPrintModal() {
  isPrintModalOpen.value = true;
}

function triggerBrowserPrint() {
  window.print();
}
</script>

