<template>
  <div class="space-y-6">
    <!-- Top Header Banner -->
    <div class="bg-gradient-to-r from-red-700 via-rose-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black pointer-events-none select-none">
        17
      </div>
      
      <div class="relative z-10 max-w-3xl space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-sm">
            DOKUMENTASI OPERASIONAL
          </span>
          <span class="px-3 py-1 bg-white/20 text-white font-extrabold text-xs rounded-full backdrop-blur-md">
            Panduan Tim Registrasi & Panitia Arena
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          Panduan Penggunaan Aplikasi 17an Arena
        </h1>
        <p class="text-slate-200 text-xs sm:text-sm leading-relaxed">
          Petunjuk lengkap operasional perlombaan: pendaftaran peserta, panggilan arena, broadcast WhatsApp (+62), penetapan juara, cetak sertifikat, hingga backup data ke Excel.
        </p>

        <!-- Quick Action Buttons Bar -->
        <div class="pt-3 flex flex-wrap items-center gap-2.5">
          <router-link
            to="/registration"
            class="px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <i class="bi bi-person-plus-fill text-red-600"></i>
            <span>Buka Registrasi Wizard</span>
          </router-link>

          <button
            @click="openBulkWaModal"
            class="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <i class="bi bi-whatsapp"></i>
            <span>Mulai Broadcast WA (+62)</span>
          </button>

          <router-link
            to="/import-export"
            class="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all"
          >
            <i class="bi bi-file-earmark-excel-fill text-emerald-400"></i>
            <span>Ekspor / Backup Excel</span>
          </router-link>

          <button
            @click="printTutorial"
            class="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <i class="bi bi-printer-fill"></i>
            <span>Cetak Cheatsheet</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:w-96">
        <i class="bi bi-search absolute left-3.5 top-3 text-slate-400 text-sm"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari topik panduan (misal: 'whatsapp', 'excel', 'juara')..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <!-- Quick Nav Category Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all"
          :class="activeCategory === cat.id ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          <i :class="[cat.icon, 'mr-1']"></i>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- MAIN CONTENT MODULES GRID -->
    <div class="space-y-6">
      
      <!-- MODULE 1: MANAJEMEN CABANG LOMBA -->
      <div
        v-if="shouldShowModule('lomba')"
        class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-xl font-bold">
              <i class="bi bi-trophy-fill"></i>
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                <span>1. Manajemen Cabang Lomba</span>
                <span class="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-extrabold rounded-md border border-red-200">
                  Modul Utama
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Langkah memasukkan daftar lomba, menentukan kategori perorangan/grup, kuota, dan lokasi arena.
              </p>
            </div>
          </div>
          <router-link
            to="/competitions"
            class="hidden sm:inline-flex px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Buka Halaman Lomba »
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-red-700">
              <i class="bi bi-plus-circle-fill"></i>
              <span>Langkah Menambah Lomba Baru</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed font-medium">
              <li>Masuk ke menu <strong class="text-slate-900">Daftar Lomba</strong> pada sidebar.</li>
              <li>Klik tombol merah <strong class="text-red-700">+ Tambah Lomba</strong> di pojok kanan atas.</li>
              <li>Isi <strong>Nama Lomba</strong> (misal: <em>Makan Kerupuk Anak</em>, <em>Tarik Tambang RT 02</em>).</li>
              <li>Pilih <strong>Kategori</strong>: <span class="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">Perorangan</span> atau <span class="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">Grup / Tim</span>.</li>
              <li>Atur <strong>Kelompok Usia</strong> (Anak-anak, Remaja, Dewasa, atau Umum) dan <strong>Batas Kuota Peserta</strong>.</li>
              <li>Klik <strong>Simpan Cabang Lomba</strong>.</li>
            </ol>
          </div>

          <div class="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
            <h3 class="font-black text-amber-900 text-xs flex items-center gap-1.5">
              <i class="bi bi-lightbulb-fill text-amber-600"></i>
              <span>Tips & Kode Prefix Otomatis</span>
            </h3>
            <ul class="list-disc list-inside space-y-1.5 text-amber-950 leading-relaxed">
              <li>Sistem akan membuatkan <strong>Kode Prefix</strong> secara otomatis (contoh: <code>KRK</code> untuk Kerupuk, <code>TRK</code> untuk Tarik Tambang).</li>
              <li>Kode prefix ini digunakan sebagai penomoran peserta otomatis saat pendaftaran (misal: <code>KRK-001</code>).</li>
              <li>Status lomba dapat diganti kapan saja dari <em>Belum Dimulai</em> menjadi <em>Berlangsung</em> atau <em>Selesai</em>.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- MODULE 2: REGISTRASI PESERTA -->
      <div
        v-if="shouldShowModule('peserta')"
        class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
              <i class="bi bi-person-plus-fill"></i>
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                <span>2. Pendaftaran & Input Data Peserta</span>
                <span class="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-md border border-emerald-200">
                  Tim Registrasi
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Dua metode input data peserta: Pendaftaran Manual dan Import Massal (Copy-Paste dari Chat WA).
              </p>
            </div>
          </div>
          <router-link
            to="/registration"
            class="hidden sm:inline-flex px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-2xs"
          >
            Buka Registrasi Wizard »
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- Manual Registration -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-emerald-700">
              <i class="bi bi-input-cursor-text"></i>
              <span>Metode A: Registrasi Manual Satu-per-Satu</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed font-medium">
              <li>Masuk ke <strong class="text-slate-900">Registrasi Wizard</strong>.</li>
              <li>Pilih cabang lomba target dari dropdown list.</li>
              <li>Isi <strong>Nama Peserta / Nama Tim</strong>.</li>
              <li>Isi <strong>Asal RT/RW</strong> (misal: <em>RT 02 / RW 05</em>).</li>
              <li>Isi <strong>Nomor WhatsApp</strong> (Bisa diketik biasa seperti <code>08123456789</code> atau <code>8123456789</code>, sistem otomatis mengubahnya menjadi format standar <strong>+62</strong>).</li>
              <li>Klik <strong class="text-emerald-700">Simpan & Buat Kartu Dada</strong>. Nomor dada unik akan dibuatkan instan!</li>
            </ol>
          </div>

          <!-- Bulk Import -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-blue-700">
              <i class="bi bi-file-earmark-spreadsheet-fill"></i>
              <span>Metode B: Import Massal (Copy-Paste Chat WA)</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed font-medium">
              <li>Klik tab <strong class="text-blue-700">Import Massal</strong> pada halaman Registrasi.</li>
              <li>Copy (salin) daftar nama dari grup WhatsApp panitia. Format yang didukung:
                <div class="bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 my-1">
                  Budi Santoso, RT 02, 081234567890<br />
                  Siti Rahma, RT 01, 085678901234<br />
                  Ahmad Subardjo, RT 03
                </div>
              </li>
              <li>Pilih cabang lomba yang dituju, lalu klik <strong class="text-blue-700">Proses Import Massal</strong>.</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- MODULE 3: BROADCAST WA -->
      <div
        v-if="shouldShowModule('wa')"
        class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-600/20">
              <i class="bi bi-whatsapp"></i>
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                <span>3. Broadcast WhatsApp Peserta (+62)</span>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md border border-emerald-200">
                  Format +62 Otomatis
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Cara mengirimkan pesan masal pendaftaran, panggilan lomba, dan pengumuman tanpa risiko nomor gagal.
              </p>
            </div>
          </div>
          <button
            @click="openBulkWaModal"
            class="hidden sm:inline-flex px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-2xs"
          >
            Coba Broadcast WA Sekarang »
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
            <h3 class="font-black text-emerald-900 text-xs flex items-center gap-1.5">
              <i class="bi bi-telephone-fill"></i>
              <span>Pengenalan Format +62</span>
            </h3>
            <p class="text-slate-700 leading-relaxed font-medium">
              Aplikasi 17an Arena kini dilengkapi engine pembersih nomor WhatsApp otomatis. Nomor lokal yang diawali <code class="text-emerald-800 font-bold">08...</code> atau <code class="text-emerald-800 font-bold">8...</code> akan otomatis dikonversi ke format resmi <strong class="text-emerald-900">+62 8...</strong>.
            </p>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-emerald-700">
              <i class="bi bi-funnel-fill"></i>
              <span>Langkah Filter & Pilih Target</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1 text-slate-600 font-medium">
              <li>Klik tombol <strong class="text-emerald-700">Broadcast WA</strong> di navbar atas.</li>
              <li>Pilih kategori lomba atau status peserta (<span class="font-bold">Menunggu</span> / <span class="font-bold">Dipanggil</span>).</li>
              <li>Gunakan checkbox untuk memilih peserta target.</li>
            </ol>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-emerald-700">
              <i class="bi bi-send-check-fill"></i>
              <span>Antrean Kirim Beruntun</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1 text-slate-600 font-medium">
              <li>Pilih template pesan (Panggilan, Pengingat, Selesai).</li>
              <li>Klik <strong class="text-emerald-700">Mulai Antrean Kirim</strong>.</li>
              <li>Sistem akan membuka chat WhatsApp Web/Desktop satu demi satu secara mulus tanpa pengetikan ulang.</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- MODULE 4: WAITING LOUNGE & OPER ROSTER MC -->
      <div
        v-if="shouldShowModule('lounge')"
        class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                <span>4. Waiting Lounge & Oper Roster ke MC</span>
                <span class="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-md border border-amber-200">
                  Petugas Lapangan & MC
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Panggilan peserta siap tampil, perpindahan status arena, dan koordinasi dengan MC panggung.
              </p>
            </div>
          </div>
          <router-link
            to="/waiting-lounge"
            class="hidden sm:inline-flex px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold transition-colors"
          >
            Buka Waiting Lounge »
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-amber-800">
              <i class="bi bi-arrow-repeat"></i>
              <span>Alur Perubahan Status Peserta</span>
            </h3>
            <div class="space-y-1.5 text-slate-700 font-medium">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">Menunggu</span>
                <span>Peserta terdaftar dan menunggu giliran.</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded text-[10px]">Dipanggil</span>
                <span>Dipanggil melalui pengeras suara / WA.</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">Siap</span>
                <span>Peserta berada di pinggir arena.</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">Bertanding</span>
                <span>Peserta tampil aktif di lapangan.</span>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-emerald-700">
              <i class="bi bi-chat-left-dots-fill"></i>
              <span>Cara Oper Roster Nama Peserta ke MC</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
              <li>Di <strong class="text-slate-900">Waiting Lounge</strong>, pilih cabang lomba yang sedang aktif.</li>
              <li>Klik tombol hijau <strong class="text-emerald-700">🎤 Oper Roster ke MC (WA)</strong>.</li>
              <li>Pilih nama MC yang bertugas (misal: <em>Kevin - MC / Host</em>).</li>
              <li>Pilih template pesan (Panggilan Peserta / Pengumuman Pemenang).</li>
              <li>Klik <strong class="text-emerald-700">Kirim WA ke MC</strong>. Format teks siap diumumkan langsung dari HP MC!</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- MODULE 5: SCORING, JUARA & SERTIFIKAT -->
      <div
        v-if="shouldShowModule('juara')"
        class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl font-bold">
              <i class="bi bi-award-fill"></i>
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                <span>5. Penilaian, Penetapan Juara, & Sertifikat</span>
                <span class="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-extrabold rounded-md border border-purple-200">
                  Pencatatan Hasil
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Pencatatan skor juri, pemenang Juara 1, 2, 3, serta cetak sertifikat ber-QR Code.
              </p>
            </div>
          </div>
          <router-link
            to="/results"
            class="hidden sm:inline-flex px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold transition-colors"
          >
            Buka Hasil Lomba »
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-purple-700">
              <i class="bi bi-trophy-fill"></i>
              <span>Menetapkan Pemenang Lomba</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
              <li>Buka menu <strong class="text-slate-900">Hasil Lomba</strong>.</li>
              <li>Pilih cabang lomba yang telah selesai bertanding.</li>
              <li>Klik tombol <strong class="text-purple-700">🏆 Tetapkan Juara</strong>.</li>
              <li>Pilih peserta untuk <strong>Juara 1</strong> (🥇), <strong>Juara 2</strong> (🥈), dan <strong>Juara 3</strong> (🥉).</li>
              <li>Klik <strong>Simpan Juara</strong>. Data akan otomatis diperbarui di Hall of Fame dan Klasemen Poin.</li>
            </ol>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-purple-700">
              <i class="bi bi-patch-check-fill"></i>
              <span>Cetak Sertifikat Digital</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
              <li>Masuk ke menu <strong class="text-slate-900">Cetak Sertifikat</strong>.</li>
              <li>Pilih pemenang yang ingin dicetak sertifikatnya.</li>
              <li>Klik <strong class="text-purple-700">🖨️ Preview / Cetak Sertifikat</strong>.</li>
              <li>Atur tampilan kertas cetak ke posisi <strong>Landscape</strong>. Sertifikat resmi ber-QR Code siap diunduh PDF atau dicetak langsung!</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- MODULE 6: BACKUP & EKSPOR EXCEL -->
      <div
        v-if="shouldShowModule('excel')"
        class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-700/20">
              <i class="bi bi-file-earmark-excel-fill"></i>
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                <span>6. Backup Data & Ekspor Excel (.xlsx)</span>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-md border border-emerald-300">
                  Keamanan Data
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Cara menyimpan rekapitulasi ke file Microsoft Excel dan membuat backup cadangan sistem.
              </p>
            </div>
          </div>
          <router-link
            to="/import-export"
            class="hidden sm:inline-flex px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-colors"
          >
            Halaman Import / Export »
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-emerald-800">
              <i class="bi bi-download"></i>
              <span>Ekspor Rekapitulasi ke Excel (.xlsx)</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
              <li>Masuk ke menu <strong class="text-slate-900">Import / Export</strong> atau tombol di navbar.</li>
              <li>Klik <strong class="text-emerald-800">📊 Download Rekap Excel (.xlsx)</strong>.</li>
              <li>Sistem akan mengunduh file spreadsheet berisi seluruh lembar kerja: <em>Daftar Lomba, Peserta, Rekap Juara, Poin Klasemen, dan Panitia</em>.</li>
            </ol>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 class="font-black text-slate-900 text-xs flex items-center gap-1.5 text-emerald-800">
              <i class="bi bi-box-arrow-down"></i>
              <span>Backup File Database (.json)</span>
            </h3>
            <ol class="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
              <li>Masuk ke menu <strong class="text-slate-900">Pengaturan</strong> ➔ Tab <strong class="text-slate-900">Data & Backup</strong>.</li>
              <li>Klik <strong class="text-emerald-800">📦 Download File Backup (.json)</strong>.</li>
              <li>Simpan file ini di flashdisk / google drive. Apabila browser di-reset, file backup dapat di-restore kapan saja!</li>
            </ol>
          </div>
        </div>
      </div>

    </div>

    <!-- PRINTABLE CHEATSHEET MODAL / SUMMARY -->
    <div class="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl border border-slate-800 print:bg-white print:text-black">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 print:border-slate-300 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black">
            <i class="bi bi-journal-check"></i>
          </div>
          <div>
            <h3 class="text-sm font-black uppercase tracking-wider text-amber-300 print:text-black">
              Ringkasan Alur Kerja Cepat Panitia (Quick Reference)
            </h3>
            <p class="text-xs text-slate-400 print:text-slate-600">
              Tempelkan lembar ini di meja pendaftaran dan meja MC selama kegiatan berlangsung.
            </p>
          </div>
        </div>
        <button
          @click="printTutorial"
          class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-transform active:scale-95 print:hidden"
        >
          <i class="bi bi-printer-fill"></i>
          <span>Cetak Lembar Ini</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 print:border-slate-300 print:bg-slate-50 space-y-1">
          <div class="font-black text-amber-300 print:text-black text-[11px] uppercase">1. Pendaftaran</div>
          <p class="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
            Input nama & WA (+62) ➔ Cetak Nomor Dada ➔ Berikan ke peserta.
          </p>
        </div>
        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 print:border-slate-300 print:bg-slate-50 space-y-1">
          <div class="font-black text-amber-300 print:text-black text-[11px] uppercase">2. Panggilan</div>
          <p class="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
            Ubah status ke "Dipanggil" ➔ Broadcast WA / Oper Roster ke MC.
          </p>
        </div>
        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 print:border-slate-300 print:bg-slate-50 space-y-1">
          <div class="font-black text-amber-300 print:text-black text-[11px] uppercase">3. Pertandingan</div>
          <p class="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
            Ubah ke "Bertanding" ➔ Juri catat skor ➔ Tetapkan Juara 1, 2, 3.
          </p>
        </div>
        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 print:border-slate-300 print:bg-slate-50 space-y-1">
          <div class="font-black text-amber-300 print:text-black text-[11px] uppercase">4. Penutupan</div>
          <p class="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
            Cetak Sertifikat ➔ Ekspor Excel ➔ Backup Database JSON.
          </p>
        </div>
      </div>
    </div>

    <!-- Bulk WhatsApp Modal Component -->
    <BulkWhatsAppModal
      :isOpen="isBulkWaOpen"
      @close="isBulkWaOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BulkWhatsAppModal from '../components/BulkWhatsAppModal.vue';

const searchQuery = ref('');
const activeCategory = ref('all');
const isBulkWaOpen = ref(false);

const categories = [
  { id: 'all', name: 'Semua Topik', icon: 'bi-grid-fill' },
  { id: 'lomba', name: 'Cabang Lomba', icon: 'bi-trophy-fill' },
  { id: 'peserta', name: 'Data Peserta', icon: 'bi-person-plus-fill' },
  { id: 'wa', name: 'Broadcast WA (+62)', icon: 'bi-whatsapp' },
  { id: 'lounge', name: 'Waiting Lounge & MC', icon: 'bi-hourglass-split' },
  { id: 'juara', name: 'Scoring & Sertifikat', icon: 'bi-award-fill' },
  { id: 'excel', name: 'Backup & Excel', icon: 'bi-file-earmark-excel-fill' }
];

function shouldShowModule(modKey: string): boolean {
  if (activeCategory.value !== 'all' && activeCategory.value !== modKey) {
    return false;
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    const keywords: Record<string, string[]> = {
      lomba: ['lomba', 'cabang', 'tambah', 'kuota', 'usia', 'kategori'],
      peserta: ['peserta', 'daftar', 'pendaftaran', 'import', 'massal', 'nomor dada'],
      wa: ['wa', 'whatsapp', 'broadcast', 'pesan', '+62', 'telepon', 'hp'],
      lounge: ['waiting', 'lounge', 'mc', 'roster', 'panggil', 'status', 'panggung'],
      juara: ['juara', 'skor', 'scoring', 'sertifikat', 'pemenang', 'hall of fame'],
      excel: ['excel', 'backup', 'export', 'xlsx', 'csv', 'json', 'restore']
    };

    const keys = keywords[modKey] || [];
    return keys.some(k => k.includes(q) || q.includes(k));
  }

  return true;
}

function openBulkWaModal() {
  isBulkWaOpen.value = true;
}

function printTutorial() {
  window.print();
}
</script>
