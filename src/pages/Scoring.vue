<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-trophy-fill text-amber-500"></i>
          <span>Penentuan Juara & Leaderboard (Drag & Drop)</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">
          Susun dan tetapkan urutan juara lomba dengan menggeser (Drag & Drop) posisi peserta secara langsung.
        </p>
      </div>

      <!-- Header Actions -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          @click="isScorePaperOpen = true"
          class="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          title="Buka Form Kertas Lapangan & Bracket Shaker Tim"
        >
          <i class="bi bi-clipboard2-check-fill text-amber-300"></i>
          <span>📝 Form Kertas & Bracket Shaker</span>
        </button>

        <button
          @click="exportAllCompetitionsLeaderboardPdf"
          class="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          title="Ekspor rekapitulasi leaderboard seluruh cabang lomba ke file PDF resmi"
        >
          <i class="bi bi-file-earmark-pdf-fill"></i>
          <span>Ekspor Semua Leaderboard (PDF)</span>
        </button>

        <!-- Select Competition -->
        <select
          v-model="selectedCompId"
          class="w-full sm:w-auto px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-2xs"
        >
          <option value="">-- Pilih Perlombaan --</option>
          <option v-for="c in store.competitions" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.category }})
          </option>
        </select>
      </div>
    </div>

    <!-- Active Competition Panel -->
    <div v-if="activeComp" class="space-y-6">
      <!-- Info Header Card for Active Competition -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              [{{ activeComp.prefix }}] {{ activeComp.category }}
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border"
              :class="activeComp.status === 'Finished' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'"
            >
              <i class="bi" :class="activeComp.status === 'Finished' ? 'bi-check-circle-fill' : 'bi-hourglass-split'"></i>
              {{ activeComp.status === 'Finished' ? 'Juara Resmi Ditetapkan' : 'Proses Penentuan Pemenang' }}
            </span>
          </div>

          <h2 class="text-xl font-black text-white flex items-center gap-2">
            <span>{{ activeComp.name }}</span>
          </h2>

          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <span class="flex items-center gap-1.5">
              <i class="bi bi-geo-alt-fill text-red-400"></i> {{ activeComp.location }}
            </span>
            <span class="flex items-center gap-1.5">
              <i class="bi bi-people-fill text-indigo-400"></i> {{ compRegistrations.length }} Peserta Terdaftar
            </span>
            <span class="flex items-center gap-1.5 text-amber-300 font-bold">
              <i class="bi bi-star-fill"></i> Poin Juara: 1st ({{ activeComp.pointFirst }}p) | 2nd ({{ activeComp.pointSecond }}p) | 3rd ({{ activeComp.pointThird }}p)
            </span>
          </div>
        </div>

        <!-- Action Button inside Header -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            @click="saveWinnersOrder"
            class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <i class="bi bi-trophy-fill text-amber-300 text-base"></i>
            <span>Simpan & Tetapkan Juara 1, 2, 3</span>
          </button>
        </div>
      </div>

      <!-- Drag & Drop Leaderboard Section -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <!-- Top Toolbar -->
        <div class="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-slate-900 text-base">Papan Urutan Pemenang (Drag & Drop)</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300 flex items-center gap-1">
                <i class="bi bi-hand-index-thumb-fill"></i> Mode Geser Aktif
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Geser baris peserta untuk menentukan peringkat. Posisi paling atas otomatis menjadi <strong>Juara 1</strong>, kedua <strong>Juara 2</strong>, dan ketiga <strong>Juara 3</strong>.
            </p>
          </div>

          <!-- Controls & Export -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="resetToDefaultOrder"
              class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              title="Kembalikan urutan sesuai nomor registrasi"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              <span>Reset Urutan</span>
            </button>

            <!-- Export CSV -->
            <button
              @click="exportCsv"
              :disabled="standings.length === 0"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-300"
              title="Export urutan pemenang ke format CSV (Excel)"
            >
              <i class="bi bi-filetype-csv text-emerald-600 text-sm"></i>
              <span>Export CSV</span>
            </button>

            <!-- Export PDF -->
            <button
              @click="exportPdf"
              :disabled="standings.length === 0"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 disabled:opacity-40 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-red-200"
              title="Cetak/Export leaderboard resmi ke PDF"
            >
              <i class="bi bi-file-earmark-pdf-fill text-red-600 text-sm"></i>
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <!-- Desktop DnD Table View (sm and up) -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-500 uppercase font-bold select-none">
              <tr>
                <th class="p-4 w-16 text-center">Atur</th>
                <th class="p-4 w-36">Peringkat</th>
                <th class="p-4 w-28">No. Reg</th>
                <th class="p-4">Nama Peserta</th>
                <th class="p-4">Status & Asal</th>
                <th class="p-4 text-center w-36">Alokasi Poin</th>
                <th class="p-4 text-center w-40">Pindah Cepat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(row, idx) in standings"
                :key="row.participant.id"
                draggable="true"
                @dragstart="onDragStart(idx, $event)"
                @dragover.prevent="onDragOver(idx)"
                @drop.prevent="onDrop(idx)"
                @dragend="onDragEnd"
                class="transition-all cursor-grab active:cursor-grabbing select-none"
                :class="[
                  idx === 0 ? 'bg-amber-50/70 hover:bg-amber-100/80 border-l-4 border-amber-400' :
                  idx === 1 ? 'bg-slate-50 hover:bg-slate-100 border-l-4 border-slate-400' :
                  idx === 2 ? 'bg-amber-900/5 hover:bg-amber-900/10 border-l-4 border-amber-700' :
                  'hover:bg-slate-50/80',
                  draggedIndex === idx ? 'opacity-40 bg-amber-100' : '',
                  dragOverIndex === idx && draggedIndex !== idx ? 'bg-amber-200/60 border-t-2 border-amber-500' : ''
                ]"
              >
                <!-- Drag Grip & Controls -->
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-700">
                    <i class="bi bi-grip-vertical text-xl cursor-grab"></i>
                    <div class="flex flex-col">
                      <button
                        type="button"
                        @click.stop="moveUp(idx)"
                        :disabled="idx === 0"
                        class="p-0.5 hover:text-red-600 disabled:opacity-20 transition-colors"
                        title="Naikkan Urutan"
                      >
                        <i class="bi bi-chevron-up text-xs font-bold"></i>
                      </button>
                      <button
                        type="button"
                        @click.stop="moveDown(idx)"
                        :disabled="idx === standings.length - 1"
                        class="p-0.5 hover:text-red-600 disabled:opacity-20 transition-colors"
                        title="Turunkan Urutan"
                      >
                        <i class="bi bi-chevron-down text-xs font-bold"></i>
                      </button>
                    </div>
                  </div>
                </td>

                <!-- Rank Badge -->
                <td class="p-4">
                  <span
                    class="px-3 py-1.5 rounded-xl font-black text-xs inline-flex items-center gap-1.5 shadow-2xs"
                    :class="[
                      idx === 0 ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' :
                      idx === 1 ? 'bg-slate-200 text-slate-900 border border-slate-300' :
                      idx === 2 ? 'bg-amber-800 text-amber-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    ]"
                  >
                    <span v-if="idx === 0">🥇 Juara 1</span>
                    <span v-else-if="idx === 1">🥈 Juara 2</span>
                    <span v-else-if="idx === 2">🥉 Juara 3</span>
                    <span v-else>#{{ idx + 1 }}</span>
                  </span>
                </td>

                <!-- Reg Number -->
                <td class="p-4 font-mono font-black text-red-700 text-xs">
                  #{{ row.registration?.participantNumber }}
                </td>

                <!-- Participant Info -->
                <td class="p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-2xs">
                      <img
                        v-if="row.participant.photoUrl"
                        :src="row.participant.photoUrl"
                        alt="Photo"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                        <i class="bi bi-person-fill text-lg"></i>
                      </div>
                    </div>
                    <div>
                      <h4 class="font-extrabold text-slate-900 text-xs sm:text-sm">{{ row.participant.name }}</h4>
                      <p class="text-[11px] text-slate-500">
                        {{ row.participant.gender === 'L' ? 'Laki-Laki' : 'Perempuan' }} • {{ row.participant.age }} Tahun
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Status & Address -->
                <td class="p-4">
                  <div class="space-y-1">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-extrabold border"
                      :class="[
                        row.registration?.status === 'Playing' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        row.registration?.status === 'Ready' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        row.registration?.status === 'Called' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      ]"
                    >
                      {{ row.registration?.status || 'Registered' }}
                    </span>
                    <p class="text-[11px] text-slate-500 truncate max-w-[160px]">
                      <i class="bi bi-geo"></i> {{ row.participant.rtRw || 'Masyarakat' }}
                    </p>
                  </div>
                </td>

                <!-- Point Allocation Badge -->
                <td class="p-4 text-center font-bold">
                  <span
                    v-if="idx === 0"
                    class="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-black border border-amber-300"
                  >
                    +{{ activeComp.pointFirst }} Poin
                  </span>
                  <span
                    v-else-if="idx === 1"
                    class="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-black border border-slate-300"
                  >
                    +{{ activeComp.pointSecond }} Poin
                  </span>
                  <span
                    v-else-if="idx === 2"
                    class="px-2.5 py-1 bg-amber-900/10 text-amber-900 rounded-lg text-xs font-black border border-amber-800/30"
                  >
                    +{{ activeComp.pointThird }} Poin
                  </span>
                  <span v-else class="text-slate-400 text-xs">0 Poin</span>
                </td>

                <!-- Quick Rank Buttons -->
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      @click.stop="moveToPosition(idx, 0)"
                      :disabled="idx === 0"
                      class="px-2 py-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-30 text-slate-950 font-black text-[10px] rounded-lg transition-colors shadow-2xs"
                      title="Set sebagai Juara 1"
                    >
                      🥇 J1
                    </button>
                    <button
                      type="button"
                      @click.stop="moveToPosition(idx, 1)"
                      :disabled="idx === 1"
                      class="px-2 py-1 bg-slate-300 hover:bg-slate-400 disabled:opacity-30 text-slate-950 font-black text-[10px] rounded-lg transition-colors shadow-2xs"
                      title="Set sebagai Juara 2"
                    >
                      🥈 J2
                    </button>
                    <button
                      type="button"
                      @click.stop="moveToPosition(idx, 2)"
                      :disabled="idx === 2"
                      class="px-2 py-1 bg-amber-800 hover:bg-amber-900 disabled:opacity-30 text-amber-100 font-black text-[10px] rounded-lg transition-colors shadow-2xs"
                      title="Set sebagai Juara 3"
                    >
                      🥉 J3
                    </button>
                    <button
                      type="button"
                      @click.stop="confirmDeleteRegistrationFromScoring(row.registration?.id)"
                      class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] rounded-lg border border-rose-200 transition-colors shadow-2xs"
                      title="Hapus Peserta dari Lomba Ini"
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="standings.length === 0">
                <td colspan="7" class="p-12 text-center space-y-3">
                  <i class="bi bi-people text-4xl text-slate-300 block"></i>
                  <p class="text-slate-500 font-medium text-xs">Belum ada peserta terdaftar untuk cabang lomba ini.</p>
                  <router-link
                    to="/registration"
                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <i class="bi bi-person-plus-fill"></i>
                    <span>Daftarkan Peserta Sekarang</span>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards View (< sm) with Drag/Up-Down Controls -->
        <div class="block sm:hidden divide-y divide-slate-100 p-3 space-y-3 bg-slate-50/50">
          <div
            v-for="(row, idx) in standings"
            :key="'mob-sc-' + row.participant.id"
            class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            :class="{
              'ring-2 ring-amber-400 bg-amber-50/40': idx === 0,
              'ring-2 ring-slate-300': idx === 1,
              'ring-2 ring-amber-800/40': idx === 2
            }"
          >
            <!-- Header: Rank Badge & Reorder Buttons -->
            <div class="flex items-center justify-between">
              <span
                class="px-3 py-1 rounded-xl font-black text-xs inline-flex items-center gap-1 shadow-2xs"
                :class="[
                  idx === 0 ? 'bg-amber-400 text-slate-950' :
                  idx === 1 ? 'bg-slate-200 text-slate-900 border border-slate-300' :
                  idx === 2 ? 'bg-amber-800 text-amber-100' :
                  'bg-slate-100 text-slate-600'
                ]"
              >
                <span v-if="idx === 0">🥇 Juara 1 (+{{ activeComp.pointFirst }}p)</span>
                <span v-else-if="idx === 1">🥈 Juara 2 (+{{ activeComp.pointSecond }}p)</span>
                <span v-else-if="idx === 2">🥉 Juara 3 (+{{ activeComp.pointThird }}p)</span>
                <span v-else>#{{ idx + 1 }}</span>
              </span>

              <div class="flex items-center space-x-1">
                <button
                  type="button"
                  @click="moveUp(idx)"
                  :disabled="idx === 0"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 rounded-lg text-xs"
                  title="Naikkan Urutan Juara"
                >
                  <i class="bi bi-arrow-up font-bold"></i>
                </button>
                <button
                  type="button"
                  @click="moveDown(idx)"
                  :disabled="idx === standings.length - 1"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 rounded-lg text-xs"
                  title="Turunkan Urutan Juara"
                >
                  <i class="bi bi-arrow-down font-bold"></i>
                </button>
              </div>
            </div>

            <!-- Body Info -->
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-2xs">
                <img
                  v-if="row.participant.photoUrl"
                  :src="row.participant.photoUrl"
                  alt="Photo"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                  <i class="bi bi-person-fill text-xl"></i>
                </div>
              </div>
              <div>
                <span class="font-mono font-bold text-red-600 text-[11px] block">
                  #{{ row.registration?.participantNumber }}
                </span>
                <h4 class="font-extrabold text-slate-900 text-sm">{{ row.participant.name }}</h4>
                <p class="text-xs text-slate-500">
                  {{ row.participant.rtRw || 'Masyarakat' }} • {{ row.participant.age }} Thn
                </p>
              </div>
            </div>

            <!-- Quick Action Buttons for Mobile -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500 text-[11px] font-medium">Pindah Cepat Podium:</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="moveToPosition(idx, 0)"
                  :disabled="idx === 0"
                  class="px-2 py-1 bg-amber-400 disabled:opacity-30 text-slate-950 font-black text-[10px] rounded-lg"
                >
                  🥇 J1
                </button>
                <button
                  type="button"
                  @click="moveToPosition(idx, 1)"
                  :disabled="idx === 1"
                  class="px-2 py-1 bg-slate-300 disabled:opacity-30 text-slate-950 font-black text-[10px] rounded-lg"
                >
                  🥈 J2
                </button>
                <button
                  type="button"
                  @click="moveToPosition(idx, 2)"
                  :disabled="idx === 2"
                  class="px-2 py-1 bg-amber-800 disabled:opacity-30 text-amber-100 font-black text-[10px] rounded-lg"
                >
                  🥉 J3
                </button>
              </div>
            </div>
          </div>

          <div v-if="standings.length === 0" class="p-6 text-center text-slate-400 text-xs">
            Belum ada peserta terdaftar untuk cabang lomba ini.
          </div>
        </div>

        <!-- Footer Action Save -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p class="text-xs text-slate-500 hidden sm:block">
            Tekan tombol di kanan untuk menyimpan keputusan juara resmi ke database dan Hall of Fame.
          </p>
          <button
            @click="saveWinnersOrder"
            :disabled="standings.length === 0"
            class="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <i class="bi bi-trophy-fill text-amber-300"></i>
            <span>Simpan & Tetapkan Juara 1, 2, 3</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State Select Competition -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
      <i class="bi bi-trophy text-5xl text-amber-400 block"></i>
      <h2 class="text-lg font-bold text-slate-800">Pilih Perlombaan Terlebih Dahulu</h2>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Pilih cabang perlombaan pada dropdown di kanan atas untuk mulai menentukan urutan pemenang dengan Drag & Drop.
      </p>
    </div>

    <!-- Competition Score Paper & Bracket Modal -->
    <CompetitionScorePaperModal :isOpen="isScorePaperOpen" :initialCompId="selectedCompId" @close="isScorePaperOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import CompetitionScorePaperModal from '../components/CompetitionScorePaperModal.vue';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

const store = useArenaStore();
const selectedCompId = ref('');
const isScorePaperOpen = ref(false);

const activeComp = computed(() => store.getCompetitionById(selectedCompId.value));

const compRegistrations = computed(() => {
  if (!selectedCompId.value) return [];
  return store.getRegistrationsByCompetition(selectedCompId.value);
});

// Standings list mapped from registered participants
const standings = ref<Array<{ participant: any; registration: any }>>([]);

// Drag & drop reactive state
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Synchronize standings whenever selected competition changes
watch(selectedCompId, (newCompId) => {
  if (!newCompId) {
    standings.value = [];
    return;
  }

  const regs = store.getRegistrationsByCompetition(newCompId);
  const existingWinner = store.winners.find(w => w.competitionId === newCompId);

  // Map registrations to participant objects
  let items = regs.map(reg => {
    const part = store.getParticipantById(reg.participantId);
    return { participant: part, registration: reg };
  }).filter(item => item.participant !== undefined);

  // If winner is already established, arrange Juara 1, 2, 3 at the top
  if (existingWinner) {
    const winner1 = items.find(i => i.participant.id === existingWinner.firstPlaceId);
    const winner2 = items.find(i => i.participant.id === existingWinner.secondPlaceId);
    const winner3 = items.find(i => i.participant.id === existingWinner.thirdPlaceId);

    const ordered: Array<{ participant: any; registration: any }> = [];
    if (winner1) ordered.push(winner1);
    if (winner2) ordered.push(winner2);
    if (winner3) ordered.push(winner3);

    // Append remaining participants
    items.forEach(i => {
      if (!ordered.some(o => o.participant.id === i.participant.id)) {
        ordered.push(i);
      }
    });

    standings.value = ordered;
  } else {
    standings.value = items;
  }
}, { immediate: true });

function resetToDefaultOrder() {
  if (!selectedCompId.value) return;
  const regs = store.getRegistrationsByCompetition(selectedCompId.value);
  standings.value = regs.map(reg => {
    const part = store.getParticipantById(reg.participantId);
    return { participant: part, registration: reg };
  }).filter(item => item.participant !== undefined);

  Swal.fire({
    icon: 'info',
    title: 'Urutan Direset',
    text: 'Peringkat dikembalikan ke urutan standar pendaftaran.',
    timer: 1200,
    showConfirmButton: false
  });
}

// Drag & Drop event handlers
function onDragStart(index: number, e: DragEvent) {
  draggedIndex.value = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
  }
}

function onDragOver(index: number) {
  dragOverIndex.value = index;
}

function onDrop(targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    onDragEnd();
    return;
  }

  const list = [...standings.value];
  const [movedItem] = list.splice(draggedIndex.value, 1);
  list.splice(targetIndex, 0, movedItem);

  standings.value = list;
  onDragEnd();
}

function onDragEnd() {
  draggedIndex.value = null;
  dragOverIndex.value = null;
}

function moveUp(index: number) {
  if (index <= 0) return;
  const list = [...standings.value];
  const temp = list[index];
  list[index] = list[index - 1];
  list[index - 1] = temp;
  standings.value = list;
}

function moveDown(index: number) {
  if (index >= standings.value.length - 1) return;
  const list = [...standings.value];
  const temp = list[index];
  list[index] = list[index + 1];
  list[index + 1] = temp;
  standings.value = list;
}

function moveToPosition(currentIndex: number, targetIndex: number) {
  if (currentIndex === targetIndex) return;
  const list = [...standings.value];
  const [moved] = list.splice(currentIndex, 1);
  list.splice(targetIndex, 0, moved);
  standings.value = list;
}

async function confirmDeleteRegistrationFromScoring(regId?: string) {
  if (!regId) return;
  const reg = store.registrations.find(r => r.id === regId);
  if (!reg) return;
  const part = store.getParticipantById(reg.participantId);

  const result = await Swal.fire({
    title: 'Hapus Peserta dari Lomba?',
    text: `Peserta ${part?.name || ''} (${reg.participantNumber}) akan dihapus dari cabang perlombaan ini.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus Peserta',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626'
  });

  if (result.isConfirmed) {
    store.deleteRegistration(regId);
    Swal.fire({
      icon: 'success',
      title: 'Peserta Dihapus',
      text: `${part?.name || 'Peserta'} telah dihapus.`,
      timer: 1200,
      showConfirmButton: false
    });
  }
}

function saveWinnersOrder() {
  if (standings.value.length === 0 || !selectedCompId.value) return;

  const first = standings.value[0]?.participant?.id;
  const second = standings.value[1]?.participant?.id;
  const third = standings.value[2]?.participant?.id;

  store.saveCompetitionWinners(selectedCompId.value, first, second, third);

  const firstName = standings.value[0]?.participant?.name || '-';
  const secondName = standings.value[1]?.participant?.name || '-';
  const thirdName = standings.value[2]?.participant?.name || '-';

  Swal.fire({
    icon: 'success',
    title: 'Juara Ditetapkan! 🏆',
    html: `
      <div class="text-left text-xs space-y-2 mt-2 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-amber-950">
        <p>🥇 <strong>Juara 1:</strong> ${firstName} (+${activeComp.value?.pointFirst || 100} Poin)</p>
        <p>🥈 <strong>Juara 2:</strong> ${secondName} (+${activeComp.value?.pointSecond || 75} Poin)</p>
        <p>🥉 <strong>Juara 3:</strong> ${thirdName} (+${activeComp.value?.pointThird || 50} Poin)</p>
      </div>
      <p class="text-xs text-slate-500 mt-3">Hasil juara resmi telah disimpan ke database & Hall of Fame.</p>
    `,
    confirmButtonColor: '#059669'
  });
}

function exportCsv() {
  if (!activeComp.value || standings.value.length === 0) return;

  const compName = activeComp.value.name;
  const headers = ['Peringkat', 'No. Registrasi', 'Nama Peserta', 'Gender', 'Umur', 'RT/RW', 'Alokasi Poin'];

  const rows = standings.value.map((row, idx) => {
    const rank = idx === 0 ? 'Juara 1' : idx === 1 ? 'Juara 2' : idx === 2 ? 'Juara 3' : `Peringkat ${idx + 1}`;
    const regNum = row.registration?.participantNumber || '-';
    const name = row.participant?.name || '-';
    const gender = row.participant?.gender === 'L' ? 'Laki-Laki' : 'Perempuan';
    const age = `${row.participant?.age || '-'} Thn`;
    const address = row.participant?.rtRw || 'Masyarakat';
    const points = idx === 0 ? activeComp.value?.pointFirst : idx === 1 ? activeComp.value?.pointSecond : idx === 2 ? activeComp.value?.pointThird : 0;

    return [rank, regNum, name, gender, age, address, points]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Leaderboard_${compName.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  Swal.fire({
    icon: 'success',
    title: 'File CSV Diexport 📊',
    text: 'Leaderboard hasil pertandingan berhasil diunduh dalam format CSV.',
    timer: 1200,
    showConfirmButton: false
  });
}

function exportPdf() {
  if (!activeComp.value || standings.value.length === 0) return;

  const doc = new jsPDF();
  const comp = activeComp.value;
  const eventName = store.settings.eventName || 'Lomba Kemerdekaan 17 Agustus';

  // Header Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(eventName.toUpperCase(), 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`REKAPITULASI HASIL JUARA & LEADERBOARD LOMBA`, 14, 27);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Cabang Lomba: ${comp.name} (${comp.category}) | Kode Prefix: [${comp.prefix}]`, 14, 34);
  doc.text(`Dicetak Pada: ${new Date().toLocaleString('id-ID')} | Total Peserta: ${standings.value.length} Orang`, 14, 40);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 44, 196, 44);

  // Table Headers
  let y = 52;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 5, 182, 7, 'F');

  doc.text('PERINGKAT', 16, y);
  doc.text('NO. REG', 50, y);
  doc.text('NAMA PESERTA', 80, y);
  doc.text('ALOKASI POIN', 160, y);

  y += 7;
  doc.setFont('helvetica', 'normal');

  standings.value.forEach((row, idx) => {
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    const rankStr = idx === 0 ? 'Juara 1 (1st)' : idx === 1 ? 'Juara 2 (2nd)' : idx === 2 ? 'Juara 3 (3rd)' : `Peringkat #${idx + 1}`;
    const regNum = `#${row.registration?.participantNumber || '-'}`;
    const name = row.participant?.name || '-';
    const pts = idx === 0 ? `${comp.pointFirst} Poin` : idx === 1 ? `${comp.pointSecond} Poin` : idx === 2 ? `${comp.pointThird} Poin` : '0 Poin';

    doc.text(rankStr, 16, y);
    doc.text(regNum, 50, y);
    doc.text(name, 80, y);
    doc.text(pts, 160, y);

    y += 7;
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y - 4, 196, y - 4);
  });

  // Official Signature Footer
  y = Math.min(y + 20, 245);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  doc.text('Mengetahui,', 25, y);
  doc.text('Tim Juri / Panitia,', 145, y);

  doc.text('( _________________________ )', 20, y + 25);
  doc.setFont('helvetica', 'bold');
  doc.text('Ketua Panitia Pelaksana', 25, y + 30);

  doc.setFont('helvetica', 'normal');
  doc.text('( _________________________ )', 140, y + 25);
  doc.setFont('helvetica', 'bold');
  doc.text('Koordinator Lomba', 148, y + 30);

  doc.save(`Leaderboard_${comp.name.replace(/\s+/g, '_')}.pdf`);

  Swal.fire({
    icon: 'success',
    title: 'File PDF Berhasil Diunduh 📄',
    text: 'Dokumen leaderboard resmi siap dicetak/diarsipkan.',
    timer: 1500,
    showConfirmButton: false
  });
}

function exportAllCompetitionsLeaderboardPdf() {
  if (store.competitions.length === 0) {
    Swal.fire('Perhatian', 'Belum ada data perlombaan terdaftar.', 'warning');
    return;
  }

  const doc = new jsPDF();
  const eventName = store.settings.eventName || 'Lomba Kemerdekaan 17 Agustus';

  store.competitions.forEach((comp, cIdx) => {
    if (cIdx > 0) doc.addPage();

    const regs = store.getRegistrationsByCompetition(comp.id);
    const winner = store.winners.find(w => w.competitionId === comp.id);

    let items = regs.map(reg => {
      const p = store.getParticipantById(reg.participantId);
      return { reg, p };
    }).filter(i => i.p !== undefined);

    if (winner) {
      const w1 = items.find(i => i.p.id === winner.firstPlaceId);
      const w2 = items.find(i => i.p.id === winner.secondPlaceId);
      const w3 = items.find(i => i.p.id === winner.thirdPlaceId);

      const ordered: Array<{ reg: any; p: any }> = [];
      if (w1) ordered.push(w1);
      if (w2) ordered.push(w2);
      if (w3) ordered.push(w3);

      items.forEach(i => {
        if (!ordered.some(o => o.p.id === i.p.id)) ordered.push(i);
      });
      items = ordered;
    }

    // Header Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(eventName.toUpperCase(), 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`REKAPITULASI HASIL JUARA & LEADERBOARD RESMI`, 14, 27);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Cabang Lomba: ${comp.name} (${comp.category}) | Kode Prefix: [${comp.prefix}]`, 14, 34);
    doc.text(`Dicetak Pada: ${new Date().toLocaleString('id-ID')} | Total Peserta: ${items.length} Orang`, 14, 40);

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 44, 196, 44);

    // Table Headers
    let y = 52;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 5, 182, 7, 'F');

    doc.text('PERINGKAT', 16, y);
    doc.text('NO. REG', 50, y);
    doc.text('NAMA PESERTA', 80, y);
    doc.text('ALOKASI POIN', 160, y);

    y += 7;
    doc.setFont('helvetica', 'normal');

    if (items.length === 0) {
      doc.text('Belum ada data peserta untuk cabang ini.', 16, y);
      y += 10;
    } else {
      items.forEach((row, idx) => {
        if (y > 255) {
          doc.addPage();
          y = 20;
        }

        const rankStr = idx === 0 ? 'Juara 1 (1st)' : idx === 1 ? 'Juara 2 (2nd)' : idx === 2 ? 'Juara 3 (3rd)' : `Peringkat #${idx + 1}`;
        const regNum = `#${row.reg.participantNumber || '-'}`;
        const name = row.p?.name || '-';
        const pts = idx === 0 ? `${comp.pointFirst} Poin` : idx === 1 ? `${comp.pointSecond} Poin` : idx === 2 ? `${comp.pointThird} Poin` : '0 Poin';

        doc.text(rankStr, 16, y);
        doc.text(regNum, 50, y);
        doc.text(name, 80, y);
        doc.text(pts, 160, y);

        y += 7;
        doc.setDrawColor(241, 245, 249);
        doc.line(14, y - 4, 196, y - 4);
      });
    }

    // Signature Block
    y = Math.min(y + 20, 245);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    doc.text('Mengetahui,', 25, y);
    doc.text('Tim Juri / Panitia,', 145, y);

    doc.text('( _________________________ )', 20, y + 22);
    doc.setFont('helvetica', 'bold');
    doc.text('Ketua Panitia Pelaksana', 25, y + 27);

    doc.setFont('helvetica', 'normal');
    doc.text('( _________________________ )', 140, y + 22);
    doc.setFont('helvetica', 'bold');
    doc.text('Koordinator Lomba', 148, y + 27);
  });

  doc.save(`Rekap_Seluruh_Leaderboard_Scoring.pdf`);

  Swal.fire({
    icon: 'success',
    title: 'Rekap Semua Leaderboard Diexport 📄',
    text: 'Dokumen PDF resmi berisi leaderboard seluruh cabang lomba berhasil diunduh.',
    timer: 1500,
    showConfirmButton: false
  });
}
</script>
