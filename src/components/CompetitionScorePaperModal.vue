<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-900/80 backdrop-blur-xs overflow-y-auto no-print-backdrop">
    <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto no-print-modal-box">
      
      <!-- MODAL HEADER (NO PRINT) -->
      <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20 no-print">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white text-xl font-black shadow-md shadow-amber-500/30">
            <i class="bi bi-clipboard2-check-fill"></i>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Form Kertas Catatan Lomba & Bracket Shaker Tim
            </h2>
            <p class="text-xs text-slate-500">
              Formulir Cetak Lapangan Panitia per-Lomba (Individu Berbaris & Bracket Tim Bola Kampung)
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

      <!-- CONTROLS & FILTER BAR (NO PRINT) -->
      <div class="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-4 no-print">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Pilih Cabang Lomba -->
          <div>
            <label class="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              <i class="bi bi-trophy-fill text-amber-600"></i> Pilih Cabang Lomba:
            </label>
            <select
              v-model="selectedCompId"
              @change="onCompetitionChange"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="">-- Pilih Cabang Lomba --</option>
              <option v-for="c in store.competitions" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.category }}) {{ c.competitionType ? '— ' + c.competitionType : '' }}
              </option>
            </select>
          </div>

          <!-- Format Form Mode -->
          <div>
            <label class="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              <i class="bi bi-diagram-3-fill text-indigo-600"></i> Format Tampilan Form:
            </label>
            <div class="grid grid-cols-2 gap-1 bg-slate-200 p-1 rounded-xl">
              <button
                @click="formMode = 'INDIVIDU'"
                class="py-1.5 px-2 text-xs font-extrabold rounded-lg transition-all"
                :class="formMode === 'INDIVIDU' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                <i class="bi bi-list-ol mr-1"></i> Individu
              </button>
              <button
                @click="formMode = 'GRUP'"
                class="py-1.5 px-2 text-xs font-extrabold rounded-lg transition-all"
                :class="formMode === 'GRUP' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                <i class="bi bi-grid-3x3-gap-fill mr-1"></i> Bracket Tim
              </button>
            </div>
          </div>

          <!-- Print & Quick Actions -->
          <div class="flex items-end justify-end space-x-2">
            <button
              @click="triggerPrint"
              class="px-5 py-2 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-105"
            >
              <i class="bi bi-printer-fill text-amber-400"></i>
              <span>Cetak Form Kertas (A4)</span>
            </button>
          </div>
        </div>

        <!-- GRUP / SHAKER TIM SETTINGS (Only visible when formMode === 'GRUP') -->
        <div v-if="formMode === 'GRUP'" class="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-3">
              <span class="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                <i class="bi bi-dice-5-fill text-indigo-600 text-base"></i>
                <span>Pengaturan Shaker Tim (Max 8 Kotak | 4 Data/Kotak):</span>
              </span>
              
              <div class="flex items-center space-x-1 bg-white border border-indigo-200 rounded-xl px-2 py-1 text-xs">
                <span class="text-[11px] font-bold text-slate-500">Jumlah Kotak:</span>
                <button
                  @click="decreaseBoxes"
                  :disabled="teamBoxes.length <= 2"
                  class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black disabled:opacity-30"
                >-</button>
                <span class="font-black text-indigo-900 px-2 text-sm">{{ teamBoxes.length }} Kotak</span>
                <button
                  @click="increaseBoxes"
                  :disabled="teamBoxes.length >= 8"
                  class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black disabled:opacity-30"
                >+</button>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="shakeTeams"
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
                :class="isShaking ? 'animate-bounce' : ''"
              >
                <i class="bi bi-dice-6-fill text-amber-300"></i>
                <span>🎲 SHAKE & RANDOMIZE TIM BOLA KAMPUNG</span>
              </button>

              <button
                @click="clearAllTeams"
                class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                title="Kosongkan Nama Anggota Tim"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>

          <p class="text-[11px] text-indigo-800 font-medium">
            💡 <strong>Instruksi Shaker:</strong> Setiap kotak menampung <strong>4 data pemain</strong> (bisa disesuaikan). Tombol Shake akan mengacak peserta yang terdaftar secara acak ke dalam {{ teamBoxes.length }} kotak tim.
          </p>
        </div>
      </div>

      <!-- PRINTABLE AREA CONTAINER -->
      <div class="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-200/70">
        <div
          id="printable-score-paper"
          class="bg-white text-slate-900 p-8 sm:p-12 shadow-xl mx-auto border border-slate-300 rounded-2xl font-sans max-w-4xl print:max-w-full print:shadow-none print:border-none print:p-0 print:m-0"
        >
          <!-- KOP SURAT RESMI PERINGATAN HUT RI -->
          <div class="border-b-4 border-slate-900 pb-3 mb-5 flex items-center justify-between gap-4 border-double">
            <div class="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl shrink-0">
              🇮🇩
            </div>

            <div class="text-center flex-1 space-y-0.5">
              <h3 class="font-extrabold text-[10px] tracking-widest text-red-600 uppercase">
                PANITIA PELAKSANA PERINGATAN HUT KEMERDEKAAN RI KE-81
              </h3>
              <h1 class="font-black text-base sm:text-lg text-slate-900 tracking-wide uppercase">
                RUKUN TETANGGA 05 / RUKUN WARGA 02 BOJONG LIO
              </h1>
              <p class="text-[11px] font-bold text-slate-700">
                FORMULIR KERTAS CATATAN HARI-H PERTANDINGAN & SKORING LAPANGAN
              </p>
            </div>

            <div class="w-12 h-12 rounded-xl border-2 border-red-600/30 bg-red-50 text-red-700 flex flex-col items-center justify-center shrink-0">
              <span class="font-black text-[9px]">HUT RI</span>
              <span class="font-black text-sm leading-none">81</span>
            </div>
          </div>

          <!-- DOCUMENT HEADER INFO -->
          <div class="bg-slate-100/80 border border-slate-300 rounded-xl p-3.5 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Cabang Lomba:</span>
              <span class="font-black text-slate-900 text-sm block">
                {{ activeCompetition?.name || 'Semua Cabang Lomba' }}
              </span>
            </div>

            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Kategori Usia:</span>
              <span class="font-bold text-slate-800 block">
                {{ activeCompetition?.category || 'Umum / Semua' }}
              </span>
            </div>

            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Lokasi & Waktu:</span>
              <span class="font-bold text-slate-800 block">
                {{ activeCompetition?.location || 'Lapangan Utama RT 05' }} ({{ activeCompetition?.time || '08:30 WIB' }})
              </span>
            </div>

            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Format Catatan:</span>
              <span class="font-black text-indigo-800 block uppercase">
                {{ formMode === 'INDIVIDU' ? 'Individu (Kebawah)' : 'Bracket Grup / Tim' }}
              </span>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- MODE 1: INDIVIDU (TABEL BERBARIS KEBAWAH)                -->
          <!-- ======================================================== -->
          <div v-if="formMode === 'INDIVIDU'" class="space-y-4">
            <div class="flex items-center justify-between pb-1 border-b border-slate-300">
              <h3 class="font-black text-sm text-slate-900 uppercase tracking-tight">
                Daftar Peserta & Lembar Pencatatan Poin / Seri / Waktu
              </h3>
              <span class="text-[11px] font-mono font-bold text-slate-500">
                Total Peserta Terdaftar: {{ participantList.length }} Orang
              </span>
            </div>

            <table class="w-full text-left border-collapse border-2 border-slate-900 text-xs">
              <thead>
                <tr class="bg-slate-900 text-white uppercase font-black text-center text-[10px] tracking-wider">
                  <th class="p-2.5 border border-slate-800 w-10">No</th>
                  <th class="p-2.5 border border-slate-800 w-24">No. Peserta</th>
                  <th class="p-2.5 border border-slate-800 text-left">Nama Lengkap Peserta</th>
                  <th class="p-2.5 border border-slate-800 w-16 text-center">RT</th>
                  <th class="p-2.5 border border-slate-800 w-28 text-center">Babak / Seri</th>
                  <th class="p-2.5 border border-slate-800 w-36 text-center">Catatan Skor / Waktu</th>
                  <th class="p-2.5 border border-slate-800 w-28 text-center">Hasil / Juara</th>
                  <th class="p-2.5 border border-slate-800 w-20 text-center">Paraf</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-300 font-medium">
                <!-- REGISTERED PARTICIPANTS -->
                <tr v-for="(p, idx) in participantList" :key="p.id" :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'">
                  <td class="p-2 border border-slate-300 text-center font-mono font-bold text-slate-700">
                    {{ idx + 1 }}
                  </td>
                  <td class="p-2 border border-slate-300 font-mono font-black text-amber-800 text-center">
                    {{ p.participantNumber }}
                  </td>
                  <td class="p-2 border border-slate-300 font-black text-slate-900">
                    <div>{{ p.name }}</div>
                    <div class="text-[9px] font-normal text-slate-500">{{ p.categoryLevel || 'Peserta' }}</div>
                  </td>
                  <td class="p-2 border border-slate-300 text-center font-bold text-slate-700">
                    {{ p.address || '05' }}
                  </td>
                  <td class="p-2 border border-slate-300 text-center text-slate-400 font-mono text-[10px]">
                    [ Seri _____ ]
                  </td>
                  <td class="p-2 border border-slate-300 text-center text-slate-400 font-mono text-[10px]">
                    _________________
                  </td>
                  <td class="p-2 border border-slate-300 text-center text-slate-400 font-mono text-[10px]">
                    [   ] Lolos  [   ] Juara
                  </td>
                  <td class="p-2 border border-slate-300 text-center text-slate-300">
                    ____
                  </td>
                </tr>

                <!-- EXTRA WALK-IN BLANK ROWS FOR ON-SITE WRITE-IN -->
                <tr v-for="n in extraWalkInRows" :key="'blank-' + n" class="bg-white">
                  <td class="p-2.5 border border-slate-300 text-center font-mono text-slate-300">
                    {{ participantList.length + n }}
                  </td>
                  <td class="p-2.5 border border-slate-300 text-center text-slate-300 font-mono text-[10px]">
                    [ ________ ]
                  </td>
                  <td class="p-2.5 border border-slate-300 text-slate-300 font-mono text-[10px]">
                    __________________________________________ (Walk-In)
                  </td>
                  <td class="p-2.5 border border-slate-300 text-center text-slate-300 font-mono text-[10px]">
                    RT ____
                  </td>
                  <td class="p-2.5 border border-slate-300 text-center text-slate-300 font-mono text-[10px]">
                    [ Seri _____ ]
                  </td>
                  <td class="p-2.5 border border-slate-300 text-center text-slate-300 font-mono text-[10px]">
                    _________________
                  </td>
                  <td class="p-2.5 border border-slate-300 text-center text-slate-300 font-mono text-[10px]">
                    [   ] Lolos  [   ] Juara
                  </td>
                  <td class="p-2.5 border border-slate-300 text-center text-slate-300">
                    ____
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ======================================================== -->
          <!-- MODE 2: GRUP / BRACKET SHAKER TIM (MAX 8 KOTAK)          -->
          <!-- ======================================================== -->
          <div v-else class="space-y-6">
            <div class="flex items-center justify-between pb-1 border-b border-slate-300">
              <h3 class="font-black text-sm text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <i class="bi bi-diagram-3-fill text-indigo-700"></i>
                <span>Bagan Pertandingan & Susunan Kotak Tim (Shaker Tim Bola Kampung)</span>
              </h3>
              <span class="text-[11px] font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {{ teamBoxes.length }} Kotak Tim (4 Pemain / Kotak)
              </span>
            </div>

            <!-- GRID KOTAK TIM (MAX 8 KOTAK, 4 DATA / KOTAK) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                v-for="(box, bIdx) in teamBoxes"
                :key="box.id"
                class="bg-slate-50 border-2 border-slate-800 rounded-xl p-3 space-y-2 shadow-2xs relative"
              >
                <!-- Box Header -->
                <div class="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                  <div class="flex items-center space-x-1.5 w-full">
                    <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                      {{ bIdx + 1 }}
                    </span>
                    <input
                      v-model="box.teamName"
                      type="text"
                      class="font-black text-xs text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:border-indigo-600 focus:outline-none w-full"
                      placeholder="Nama Tim..."
                    />
                  </div>
                </div>

                <!-- 4 Players Slots per Box -->
                <div class="space-y-1.5 pt-1">
                  <div
                    v-for="(slot, sIdx) in box.players"
                    :key="sIdx"
                    class="p-1.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between gap-1"
                  >
                    <span class="text-[9px] font-mono font-bold text-slate-400 shrink-0">#{{ sIdx + 1 }}</span>
                    <input
                      v-model="box.players[sIdx]"
                      type="text"
                      placeholder="Kosong (Tulis / Shake)..."
                      class="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- TOURNAMENT MATCHUP & BRACKET TABLE (A4 PRINT FRIENDLY) -->
            <div class="border-2 border-slate-900 rounded-xl p-4 bg-white space-y-4">
              <h4 class="font-black text-xs uppercase tracking-wider text-slate-900 text-center border-b pb-2">
                🏆 TOURNAMENT MATCHUP & LEMBAR SKOR LAPANGAN (BOLA KAMPUNG)
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- MATCH 1: Tim 1 vs Tim 2 -->
                <div class="border border-slate-400 rounded-lg p-2.5 space-y-1 bg-slate-50">
                  <div class="flex items-center justify-between text-xs font-black">
                    <span class="text-indigo-900">PERTANDINGAN 1 (Match A)</span>
                    <span class="text-[10px] text-slate-500 font-mono">Penyisihan</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[0]?.teamName || 'Kotak Tim 1' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="text-center font-black text-[10px] text-slate-400">VS</div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[1]?.teamName || 'Kotak Tim 2' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="pt-1 text-[10px] font-mono text-slate-600 flex justify-between">
                    <span>Pemenang Match A:</span>
                    <span>___________________</span>
                  </div>
                </div>

                <!-- MATCH 2: Tim 3 vs Tim 4 -->
                <div class="border border-slate-400 rounded-lg p-2.5 space-y-1 bg-slate-50">
                  <div class="flex items-center justify-between text-xs font-black">
                    <span class="text-indigo-900">PERTANDINGAN 2 (Match B)</span>
                    <span class="text-[10px] text-slate-500 font-mono">Penyisihan</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[2]?.teamName || 'Kotak Tim 3' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="text-center font-black text-[10px] text-slate-400">VS</div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[3]?.teamName || 'Kotak Tim 4' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="pt-1 text-[10px] font-mono text-slate-600 flex justify-between">
                    <span>Pemenang Match B:</span>
                    <span>___________________</span>
                  </div>
                </div>

                <!-- MATCH 3 (If >= 6 boxes): Tim 5 vs Tim 6 -->
                <div v-if="teamBoxes.length >= 6" class="border border-slate-400 rounded-lg p-2.5 space-y-1 bg-slate-50">
                  <div class="flex items-center justify-between text-xs font-black">
                    <span class="text-indigo-900">PERTANDINGAN 3 (Match C)</span>
                    <span class="text-[10px] text-slate-500 font-mono">Penyisihan</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[4]?.teamName || 'Kotak Tim 5' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="text-center font-black text-[10px] text-slate-400">VS</div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[5]?.teamName || 'Kotak Tim 6' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="pt-1 text-[10px] font-mono text-slate-600 flex justify-between">
                    <span>Pemenang Match C:</span>
                    <span>___________________</span>
                  </div>
                </div>

                <!-- MATCH 4 (If 8 boxes): Tim 7 vs Tim 8 -->
                <div v-if="teamBoxes.length >= 8" class="border border-slate-400 rounded-lg p-2.5 space-y-1 bg-slate-50">
                  <div class="flex items-center justify-between text-xs font-black">
                    <span class="text-indigo-900">PERTANDINGAN 4 (Match D)</span>
                    <span class="text-[10px] text-slate-500 font-mono">Penyisihan</span>
                  </div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[6]?.teamName || 'Kotak Tim 7' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="text-center font-black text-[10px] text-slate-400">VS</div>
                  <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-300 font-bold text-xs">
                    <span>{{ teamBoxes[7]?.teamName || 'Kotak Tim 8' }}</span>
                    <span class="font-mono text-slate-400">Skor: [   ]</span>
                  </div>
                  <div class="pt-1 text-[10px] font-mono text-slate-600 flex justify-between">
                    <span>Pemenang Match D:</span>
                    <span>___________________</span>
                  </div>
                </div>
              </div>

              <!-- FINAL & WINNER BOX -->
              <div class="bg-amber-50 border-2 border-amber-500/50 rounded-xl p-3 space-y-2">
                <div class="text-center font-black text-xs text-amber-950 uppercase tracking-wider">
                  🔥 BABAK FINAL & REKAPITULASI PEMENANG JUARA 1, 2, 3
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                  <div class="bg-white p-2 rounded border border-amber-300">
                    <span class="block text-[10px] text-amber-800 font-black">🥇 JUARA 1:</span>
                    <span class="block font-mono text-slate-400">________________________</span>
                  </div>
                  <div class="bg-white p-2 rounded border border-amber-300">
                    <span class="block text-[10px] text-slate-700 font-black">🥈 JUARA 2:</span>
                    <span class="block font-mono text-slate-400">________________________</span>
                  </div>
                  <div class="bg-white p-2 rounded border border-amber-300">
                    <span class="block text-[10px] text-amber-900 font-black">🥉 JUARA 3:</span>
                    <span class="block font-mono text-slate-400">________________________</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SIGNATURE & VERIFICATION FOOTER -->
          <div class="mt-8 pt-4 border-t-2 border-slate-300 page-break-inside-avoid">
            <div class="flex items-center justify-between text-xs text-slate-800 font-medium px-2">
              <div class="text-center space-y-1 min-w-[180px]">
                <p class="font-bold text-slate-600 text-[10px]">Mengetahui,</p>
                <p class="font-black text-slate-900 uppercase text-xs">Ketua RT 05 / RW 02</p>
                <div class="h-12 flex items-center justify-center">
                  <span class="text-[9px] text-slate-300 italic border border-dashed border-slate-300 rounded px-2 py-0.5 no-print">
                    (Tanda Tangan)
                  </span>
                </div>
                <p class="font-extrabold text-slate-900 underline text-xs">
                  {{ store.settings.rtName || 'Bp. H. Slamet' }}
                </p>
              </div>

              <div class="text-center text-[10px] text-slate-400 italic space-y-1 hidden sm:block">
                <p class="font-bold text-slate-600">Bojong Lio, {{ formattedDate }}</p>
                <div class="w-12 h-12 rounded-full border border-red-500/20 mx-auto flex items-center justify-center text-red-500 font-bold text-[8px] uppercase tracking-tighter rotate-12">
                  PANITIA LAPANGAN
                </div>
              </div>

              <div class="text-center space-y-1 min-w-[180px]">
                <p class="font-bold text-slate-600 text-[10px]">Bojong Lio, {{ formattedDate }}</p>
                <p class="font-black text-slate-900 uppercase text-xs">PIC Seksi Lomba / Wasit</p>
                <div class="h-12 flex items-center justify-center">
                  <span class="text-[9px] text-slate-300 italic border border-dashed border-slate-300 rounded px-2 py-0.5 no-print">
                    (Tanda Tangan)
                  </span>
                </div>
                <p class="font-extrabold text-slate-900 underline text-xs">
                  (________________________)
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- MODAL FOOTER (NO PRINT) -->
      <div class="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 sticky bottom-0 no-print">
        <button
          @click="$emit('close')"
          class="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          Tutup
        </button>

        <div class="flex items-center space-x-2">
          <button
            @click="triggerPrint"
            class="px-5 py-2 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <i class="bi bi-printer-fill text-amber-400"></i>
            <span>Cetak Form Kertas (A4)</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import Swal from 'sweetalert2';

const props = defineProps<{
  isOpen: boolean;
  initialCompId?: string;
}>();

defineEmits(['close']);

const store = useArenaStore();

const selectedCompId = ref('');
const formMode = ref<'INDIVIDU' | 'GRUP'>('INDIVIDU');
const extraWalkInRows = ref(8);
const isShaking = ref(false);

interface TeamBox {
  id: string;
  teamName: string;
  players: string[];
}

// Default 4 boxes with 4 players each
const teamBoxes = ref<TeamBox[]>([
  { id: '1', teamName: 'Kotak Tim 1 (Garuda)', players: ['', '', '', ''] },
  { id: '2', teamName: 'Kotak Tim 2 (Rajawali)', players: ['', '', '', ''] },
  { id: '3', teamName: 'Kotak Tim 3 (Kancil)', players: ['', '', '', ''] },
  { id: '4', teamName: 'Kotak Tim 4 (Bison)', players: ['', '', '', ''] }
]);

const activeCompetition = computed(() => {
  if (!selectedCompId.value) return store.competitions[0] || null;
  return store.competitions.find(c => c.id === selectedCompId.value) || store.competitions[0] || null;
});

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

// List of participants registered for the selected competition
const participantList = computed(() => {
  if (!activeCompetition.value) return [];
  const compId = activeCompetition.value.id;
  const regs = store.registrations.filter(r => r.competitionId === compId);
  
  if (regs.length > 0) {
    return regs.map(r => {
      const p = store.participants.find(part => part.id === r.participantId);
      return {
        id: p?.id || r.id,
        participantNumber: r.participantNumber,
        name: p?.name || 'Peserta',
        categoryLevel: p?.categoryLevel || 'Umum',
        address: p?.address || '05'
      };
    });
  }

  // Fallback if no specific registration exists, list general participants
  return store.participants.slice(0, 30).map((p, idx) => ({
    id: p.id,
    participantNumber: `P-${String(idx + 1).padStart(3, '0')}`,
    name: p.name,
    categoryLevel: p.categoryLevel || 'Umum',
    address: p.address || '05'
  }));
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.initialCompId) {
      selectedCompId.value = props.initialCompId;
    } else if (store.competitions.length > 0) {
      selectedCompId.value = store.competitions[0].id;
    }
    onCompetitionChange();
  }
});

function onCompetitionChange() {
  const comp = activeCompetition.value;
  if (!comp) return;

  const nameLower = comp.name.toLowerCase();
  const typeLower = (comp.competitionType || '').toLowerCase();
  const catLower = (comp.category || '').toLowerCase();

  if (
    nameLower.includes('bola') ||
    nameLower.includes('tambang') ||
    nameLower.includes('bakiak') ||
    nameLower.includes('suap') ||
    typeLower.includes('tim') ||
    typeLower.includes('grup') ||
    catLower.includes('grup')
  ) {
    formMode.value = 'GRUP';
  } else {
    formMode.value = 'INDIVIDU';
  }

  loadSavedTeamBoxes();
}

function loadSavedTeamBoxes() {
  const compId = activeCompetition.value?.id || 'default';
  const saved = localStorage.getItem(`17an_team_boxes_${compId}`);
  if (saved) {
    try {
      teamBoxes.value = JSON.parse(saved);
    } catch {
      // ignore
    }
  }
}

function saveTeamBoxes() {
  const compId = activeCompetition.value?.id || 'default';
  localStorage.setItem(`17an_team_boxes_${compId}`, JSON.stringify(teamBoxes.value));
}

function increaseBoxes() {
  if (teamBoxes.value.length >= 8) return;
  const nextNum = teamBoxes.value.length + 1;
  teamBoxes.value.push({
    id: String(nextNum),
    teamName: `Kotak Tim ${nextNum}`,
    players: ['', '', '', '']
  });
  saveTeamBoxes();
}

function decreaseBoxes() {
  if (teamBoxes.value.length <= 2) return;
  teamBoxes.value.pop();
  saveTeamBoxes();
}

function clearAllTeams() {
  teamBoxes.value.forEach(box => {
    box.players = ['', '', '', ''];
  });
  saveTeamBoxes();
}

// 🎲 SHAKER TIM / RANDOMIZER ALGORITHM
function shakeTeams() {
  isShaking.value = true;
  
  // Audio chime feedback using Web Audio API
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch {
    // Ignore audio errors
  }

  setTimeout(() => {
    // Get list of participant names to shuffle
    let pool = participantList.value.map(p => p.name);
    if (pool.length === 0) {
      pool = ['Budi', 'Siti', 'Agus', 'Dewi', 'Rian', 'Andi', 'Doni', 'Maya', 'Eko', 'Rina', 'Toni', 'Santi', 'Fajar', 'Gita', 'Hadi', 'Indah'];
    }

    // Fisher-Yates Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Distribute into 4 slots per box
    let poolIdx = 0;
    teamBoxes.value.forEach(box => {
      for (let s = 0; s < 4; s++) {
        if (poolIdx < pool.length) {
          box.players[s] = pool[poolIdx];
          poolIdx++;
        } else {
          box.players[s] = `Pemain ${s + 1}`;
        }
      }
    });

    saveTeamBoxes();
    isShaking.value = false;

    Swal.fire({
      icon: 'success',
      title: '🎲 Shaker Tim Selesai!',
      text: `${pool.length} Pemain berhasil diacak ke dalam ${teamBoxes.value.length} Kotak Tim.`,
      timer: 1600,
      showConfirmButton: false
    });
  }, 400);
}

function triggerPrint() {
  window.print();
}

onMounted(() => {
  if (props.initialCompId) {
    selectedCompId.value = props.initialCompId;
  } else if (store.competitions.length > 0) {
    selectedCompId.value = store.competitions[0].id;
  }
  onCompetitionChange();
});
</script>

<style scoped>
@media print {
  .no-print,
  .no-print-backdrop,
  header,
  nav,
  aside,
  button {
    display: none !important;
  }

  .no-print-modal-box {
    max-height: none !important;
    overflow: visible !important;
    border: none !important;
    box-shadow: none !important;
    width: 100% !important;
    max-width: none !important;
    border-radius: 0 !important;
  }

  #printable-score-paper {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    max-width: none !important;
    width: 100% !important;
  }
}
</style>
