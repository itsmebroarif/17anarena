<template>
  <div class="space-y-4 pb-20">
    <!-- Top Mobile Easy Mode Header Banner -->
    <div class="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
      <!-- Decorative Background Circles -->
      <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-lg"></div>

      <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-full border border-white/30 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
              MODE LAPANGAN EASY MODE
            </span>
            <span class="text-xs font-semibold opacity-90">17-AN ARENA</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Kontrol Cepat Panitia Lapangan
          </h1>
          <p class="text-xs text-red-50 font-medium mt-0.5">
            Tampilan super simpel dengan tombol besar untuk pemanggilan, input skor, & registrasi di arena.
          </p>
        </div>

        <!-- Quick Mode Switcher Button -->
        <router-link
          to="/"
          class="shrink-0 px-3.5 py-2 bg-white text-red-700 hover:bg-red-50 font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 border border-white/50"
        >
          <i class="bi bi-grid-fill"></i>
          <span>Mode Full App</span>
        </router-link>
      </div>
    </div>

    <!-- Live Arena Overview Stats Widget -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl shrink-0">
          <i class="bi bi-trophy-fill"></i>
        </div>
        <div>
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Lomba</div>
          <div class="text-lg font-black text-slate-900 leading-tight">{{ store.competitions.length }}</div>
        </div>
      </div>

      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
          <i class="bi bi-hourglass-split animate-spin"></i>
        </div>
        <div>
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menunggu Panggil</div>
          <div class="text-lg font-black text-amber-600 leading-tight">{{ store.dashboardStats.waiting }}</div>
        </div>
      </div>

      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0">
          <i class="bi bi-people-fill"></i>
        </div>
        <div>
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Peserta</div>
          <div class="text-lg font-black text-slate-900 leading-tight">{{ store.participants.length }}</div>
        </div>
      </div>

      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shrink-0">
          <i class="bi bi-award-fill"></i>
        </div>
        <div>
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Juara Terdata</div>
          <div class="text-lg font-black text-slate-900 leading-tight">{{ store.winners.length }}</div>
        </div>
      </div>
    </div>

    <!-- Active Competition Selector Bar -->
    <div class="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
      <label class="block text-xs font-black uppercase tracking-wider text-slate-600 flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <i class="bi bi-flag-fill text-red-600"></i>
          Pilih Cabang Lomba Aktif di Arena
        </span>
        <span v-if="selectedCompetition" class="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Status: {{ selectedCompetition.status }}
        </span>
      </label>

      <select
        v-model="selectedCompetitionId"
        class="w-full text-sm font-extrabold p-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-red-600 focus:outline-none transition-all"
      >
        <option value="">-- Pilih Lomba Yang Sedang Berjalan --</option>
        <option v-for="comp in store.competitions" :key="comp.id" :value="comp.id">
          {{ comp.name }} ({{ comp.category }}) - {{ comp.status }}
        </option>
      </select>
    </div>

    <!-- Main Easy Mode Tabs (Large Touch Friendly Buttons) -->
    <div class="grid grid-cols-4 gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl">
      <button
        type="button"
        @click="activeTab = 'panggil'"
        class="py-2.5 px-1 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
        :class="activeTab === 'panggil' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'"
      >
        <i class="bi bi-megaphone-fill text-base"></i>
        <span class="text-[10px] leading-tight">1. Panggil</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'skor'"
        class="py-2.5 px-1 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
        :class="activeTab === 'skor' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'"
      >
        <i class="bi bi-calculator-fill text-base"></i>
        <span class="text-[10px] leading-tight">2. Skor</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'daftar'"
        class="py-2.5 px-1 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
        :class="activeTab === 'daftar' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'"
      >
        <i class="bi bi-person-plus-fill text-base"></i>
        <span class="text-[10px] leading-tight">3. Daftar</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'rundown'"
        class="py-2.5 px-1 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
        :class="activeTab === 'rundown' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'"
      >
        <i class="bi bi-clock-history text-base"></i>
        <span class="text-[10px] leading-tight">4. Rundown</span>
      </button>
    </div>

    <!-- TAB 1: EASY PEMANGGILAN (WAITING LOUNGE) -->
    <div v-if="activeTab === 'panggil'" class="space-y-3">
      <!-- One Tap Call Big Button -->
      <div v-if="selectedCompetitionId" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-center">
        <div class="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Panggil Peserta Lomba Ringkas</div>
        
        <div v-if="nextWaitingRegistration" class="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
          <div class="text-xs font-bold text-amber-800">GILIRAN BERIKUTNYA</div>
          <div class="text-2xl font-black text-slate-900">{{ nextWaitingRegistration.participantName }}</div>
          <div class="text-xs font-bold text-slate-600">
            No: <span class="font-mono text-red-600 bg-white px-2 py-0.5 rounded border">{{ nextWaitingRegistration.participantCode || nextWaitingRegistration.id }}</span>
            • RT: {{ nextWaitingRegistration.rt || '05' }}
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2">
            <button
              @click="triggerCall(nextWaitingRegistration)"
              class="py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <i class="bi bi-volume-up-fill text-lg"></i>
              <span>Panggil Suara</span>
            </button>

            <button
              @click="markCalling(nextWaitingRegistration)"
              class="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <i class="bi bi-check-circle-fill text-lg"></i>
              <span>Tandai Masuk Arena</span>
            </button>
          </div>
        </div>

        <div v-else class="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs font-bold">
          Tidak ada peserta yang sedang antre panggilan untuk lomba ini.
        </div>
      </div>

      <!-- List Peserta Waiting Lounge Ringkas -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 class="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center justify-between">
          <span>Daftar Peserta Menunggu Panggilan</span>
          <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-mono">{{ waitingRegistrations.length }} Orang</span>
        </h3>

        <div v-if="waitingRegistrations.length === 0" class="text-center py-6 text-slate-400 text-xs">
          Belum ada peserta terdaftar dalam daftar tunggu.
        </div>

        <div v-else class="space-y-2 max-h-80 overflow-y-auto pr-1">
          <div
            v-for="reg in waitingRegistrations"
            :key="reg.id"
            class="p-3 bg-slate-50 hover:bg-red-50/50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
          >
            <div>
              <div class="font-extrabold text-sm text-slate-900">{{ reg.participantName }}</div>
              <div class="text-[11px] text-slate-500 font-medium">
                RT {{ reg.rt || '05' }} • Kode: <span class="font-mono text-red-600 font-bold">{{ reg.participantCode || reg.id }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="triggerCall(reg)"
                class="p-2 bg-amber-500 text-white rounded-lg font-bold text-xs active:scale-95 flex items-center gap-1"
                title="Panggil Suara"
              >
                <i class="bi bi-megaphone-fill"></i>
              </button>
              <button
                @click="markCalling(reg)"
                class="px-2.5 py-1.5 bg-red-600 text-white rounded-lg font-bold text-xs active:scale-95 flex items-center gap-1"
              >
                <span>Arena</span>
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: EASY SKORING (QUICK INPUT SCORE) -->
    <div v-if="activeTab === 'skor'" class="space-y-3">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-black text-xs uppercase tracking-wider text-slate-800">
            Input Skor / Pemenang Arena Cepat
          </h3>
          <span class="text-[10px] font-bold text-slate-400">1-Tap Winner</span>
        </div>

        <div v-if="!selectedCompetitionId" class="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold text-center">
          Pilih Cabang Lomba Aktif di bagian atas terlebih dahulu.
        </div>

        <template v-else>
          <!-- Select Participant -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Pilih Peserta / Regu:</label>
            <select
              v-model="scoringParticipantId"
              class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-sm"
            >
              <option value="">-- Pilih Peserta --</option>
              <option v-for="reg in competitionRegistrations" :key="reg.id" :value="reg.participantId">
                {{ reg.participantName }} (RT {{ reg.rt || '05' }})
              </option>
            </select>
          </div>

          <!-- Quick Rank Selection Buttons (Big Touch Targets) -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Tetapkan Posisi Juara Langsung:</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="quickScoreRank = 1"
                class="py-3 px-2 rounded-xl font-black text-xs border-2 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                :class="quickScoreRank === 1 ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'"
              >
                <i class="bi bi-trophy-fill text-xl text-amber-600"></i>
                <span>JUARA 1</span>
              </button>

              <button
                type="button"
                @click="quickScoreRank = 2"
                class="py-3 px-2 rounded-xl font-black text-xs border-2 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                :class="quickScoreRank === 2 ? 'bg-slate-300 border-slate-400 text-slate-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'"
              >
                <i class="bi bi-award-fill text-xl text-slate-600"></i>
                <span>JUARA 2</span>
              </button>

              <button
                type="button"
                @click="quickScoreRank = 3"
                class="py-3 px-2 rounded-xl font-black text-xs border-2 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                :class="quickScoreRank === 3 ? 'bg-amber-700 border-amber-800 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'"
              >
                <i class="bi bi-award-fill text-xl text-amber-200"></i>
                <span>JUARA 3</span>
              </button>
            </div>
          </div>

          <!-- Skor Angka & Catatan Optional -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Skor Poin (Optional):</label>
              <input
                v-model.number="quickScoreVal"
                type="number"
                placeholder="mis. 100"
                class="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm text-center"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Catatan Waktu/Skor:</label>
              <input
                v-model="quickScoreNotes"
                type="text"
                placeholder="mis. 01:23 / 5 Gol"
                class="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs"
              />
            </div>
          </div>

          <!-- Submit Score Button -->
          <button
            @click="saveQuickScore"
            :disabled="!scoringParticipantId"
            class="w-full py-3.5 bg-red-600 disabled:bg-slate-300 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i class="bi bi-check2-circle text-lg"></i>
            <span>Simpan Pemenang / Skor Lapangan</span>
          </button>
        </template>
      </div>
    </div>

    <!-- TAB 3: EASY DAFTAR PESERTA (5-SECOND REGISTRATION) -->
    <div v-if="activeTab === 'daftar'" class="space-y-3">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-black text-xs uppercase tracking-wider text-slate-800">
            Daftar Peserta Baru (Express Lapangan)
          </h3>
          <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Format 5 Detik
          </span>
        </div>

        <form @submit.prevent="saveQuickRegistration" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Peserta / Nama Tim (*):</label>
            <input
              v-model="regForm.name"
              type="text"
              required
              placeholder="Masukkan nama lengkap / nama regu..."
              class="w-full p-3 rounded-xl border-2 border-slate-200 font-bold text-sm focus:border-red-600 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Wilayah RT (*):</label>
              <select
                v-model="regForm.rt"
                class="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
              >
                <option value="05">RT 05 (Tuan Rumah)</option>
                <option value="01">RT 01</option>
                <option value="02">RT 02</option>
                <option value="03">RT 03</option>
                <option value="04">RT 04</option>
                <option value="06">RT 06</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Usia & Tingkat:</label>
              <select
                v-model="regForm.categoryLevel"
                class="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white"
              >
                <optgroup label="👶 Anak-anak (TK & SD)">
                  <option value="Anak-anak (TK)">Anak-anak (TK)</option>
                  <option value="Anak-anak (SD Kelas 1)">Anak-anak (SD Kelas 1)</option>
                  <option value="Anak-anak (SD Kelas 2)">Anak-anak (SD Kelas 2)</option>
                  <option value="Anak-anak (SD Kelas 3)">Anak-anak (SD Kelas 3)</option>
                  <option value="Anak-anak (SD Kelas 4)">Anak-anak (SD Kelas 4)</option>
                  <option value="Anak-anak (SD Kelas 5)">Anak-anak (SD Kelas 5)</option>
                  <option value="Anak-anak (SD Kelas 6)">Anak-anak (SD Kelas 6)</option>
                </optgroup>
                <optgroup label="👦 Remaja (SMP & SMA)">
                  <option value="Remaja (SMP)">Remaja (SMP)</option>
                  <option value="Remaja (SMA)">Remaja (SMA)</option>
                </optgroup>
                <optgroup label="👨 Dewasa">
                  <option value="Dewasa">Dewasa</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Pilih Cabang Lomba (*):</label>
            <select
              v-model="regForm.competitionId"
              required
              class="w-full p-3 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 focus:bg-white"
            >
              <option value="">-- Pilih Cabang Lomba --</option>
              <option v-for="comp in store.competitions" :key="comp.id" :value="comp.id">
                {{ comp.name }} ({{ comp.category }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP (Optional):</label>
            <input
              v-model="regForm.phone"
              type="tel"
              placeholder="0812xxxxxxxx"
              class="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i class="bi bi-person-check-fill text-lg"></i>
            <span>Daftarkan Peserta Sekarang</span>
          </button>
        </form>

        <div class="pt-2 border-t border-slate-100">
          <button
            type="button"
            @click="isPaperModalOpen = true"
            class="w-full py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <i class="bi bi-printer-fill text-blue-600"></i>
            <span>Paper Template Pendaftaran Bulking (PDF/A4)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 4: EASY RUNDOWN & BROADCAST WA -->
    <div v-if="activeTab === 'rundown'" class="space-y-3">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-black text-xs uppercase tracking-wider text-slate-800">
            Jadwal Acara (Rundown Lapangan)
          </h3>
          <router-link to="/rundown" class="text-[10px] font-bold text-red-600 hover:underline">
            Lihat Lengkap A4
          </router-link>
        </div>

        <div v-if="store.rundownItems.length === 0" class="text-center py-6 text-slate-400 text-xs">
          Belum ada susunan acara rundown tersimpan.
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in store.rundownItems"
            :key="item.id"
            class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 bg-slate-200 text-slate-800 font-mono font-black text-[10px] rounded">
                {{ item.timeStart }} - {{ item.timeEnd }} WIB
              </span>
              <span
                class="px-2 py-0.5 text-[10px] font-extrabold rounded-full"
                :class="{
                  'bg-emerald-100 text-emerald-800': item.status === 'Selesai',
                  'bg-amber-100 text-amber-800 animate-pulse': item.status === 'Sedang Berlangsung',
                  'bg-slate-200 text-slate-600': item.status === 'Belum Mulai'
                }"
              >
                {{ item.status }}
              </span>
            </div>

            <div class="font-extrabold text-sm text-slate-900">{{ item.activity }}</div>
            <div class="text-[11px] text-slate-500 font-medium">
              PIC: {{ item.pic || 'Panitia' }} • Lokasi: {{ item.location || 'Lapangan Utama' }}
            </div>

            <!-- Quick Status Change Buttons -->
            <div class="flex items-center gap-1.5 pt-1">
              <button
                @click="updateRundownStatus(item, 'Belum Mulai')"
                class="px-2 py-1 text-[10px] font-bold rounded border bg-white hover:bg-slate-100 text-slate-600"
              >
                Pending
              </button>
              <button
                @click="updateRundownStatus(item, 'Sedang Berlangsung')"
                class="px-2 py-1 text-[10px] font-bold rounded border bg-amber-500 text-white"
              >
                Start Live
              </button>
              <button
                @click="updateRundownStatus(item, 'Selesai')"
                class="px-2 py-1 text-[10px] font-bold rounded border bg-emerald-600 text-white"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Paper Template Modal -->
    <RegistrationPaperTemplateModal
      :isOpen="isPaperModalOpen"
      @close="isPaperModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import RegistrationPaperTemplateModal from '../components/RegistrationPaperTemplateModal.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const isPaperModalOpen = ref(false);

const activeTab = ref<'panggil' | 'skor' | 'daftar' | 'rundown'>('panggil');
const selectedCompetitionId = ref('');

const selectedCompetition = computed(() => {
  return store.competitions.find(c => c.id === selectedCompetitionId.value);
});

// Registrations for selected competition
const competitionRegistrations = computed(() => {
  if (!selectedCompetitionId.value) return [];
  return store.registrations.filter(r => r.competitionId === selectedCompetitionId.value);
});

const waitingRegistrations = computed(() => {
  if (!selectedCompetitionId.value) return store.registrations.filter(r => r.status === 'Menunggu');
  return store.registrations.filter(r => r.competitionId === selectedCompetitionId.value && r.status === 'Menunggu');
});

const nextWaitingRegistration = computed(() => {
  return waitingRegistrations.value[0] || null;
});

// Sound Chime Effect
function playBellSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (err) {
    console.log('Audio chime error:', err);
  }
}

function triggerCall(reg: unknown) {
  playBellSound();
  const r = reg as { participantName: string; participantCode?: string; id: string };
  Swal.fire({
    title: '🔊 MEMANGGIL PESERTA!',
    text: `Panggilan untuk ${r.participantName} (Kode: ${r.participantCode || r.id})`,
    icon: 'info',
    confirmButtonText: 'OK, Panggilan Terkirim',
    confirmButtonColor: '#dc2626'
  });
}

function markCalling(reg: unknown) {
  const r = reg as { id: string; participantName: string };
  store.updateRegistrationStatus(r.id, 'Dipanggil');
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `${r.participantName} Memasuki Arena`,
    showConfirmButton: false,
    timer: 1500
  });
}

// TAB 2: Quick Score
const scoringParticipantId = ref('');
const quickScoreRank = ref<number>(1);
const quickScoreVal = ref<number | undefined>(undefined);
const quickScoreNotes = ref('');

function saveQuickScore() {
  if (!selectedCompetitionId.value || !scoringParticipantId.value) return;

  const comp = selectedCompetition.value;
  const participant = store.participants.find(p => p.id === scoringParticipantId.value);
  if (!comp || !participant) return;

  store.saveWinner({
    competitionId: comp.id,
    competitionName: comp.name,
    participantId: participant.id,
    participantName: participant.name,
    rt: participant.rt,
    rank: quickScoreRank.value as 1 | 2 | 3,
    score: quickScoreVal.value || 0,
    notes: quickScoreNotes.value || `Hasil Arena Easy Mode`
  });

  Swal.fire({
    icon: 'success',
    title: 'Skor & Pemenang Disimpan!',
    text: `${participant.name} ditetapkan sebagai Juara ${quickScoreRank.value} pada ${comp.name}.`,
    confirmButtonColor: '#dc2626'
  });

  scoringParticipantId.value = '';
  quickScoreVal.value = undefined;
  quickScoreNotes.value = '';
}

// TAB 3: Quick Registration
const regForm = ref({
  name: '',
  rt: '05',
  categoryLevel: 'Anak-anak (SD Kelas 1)',
  competitionId: '',
  phone: ''
});

function saveQuickRegistration() {
  if (!regForm.value.name || !regForm.value.competitionId) return;

  const comp = store.competitions.find(c => c.id === regForm.value.competitionId);
  if (!comp) return;

  let age = 10;
  if (regForm.value.categoryLevel.includes('TK')) age = 5;
  else if (regForm.value.categoryLevel.includes('Kelas 1')) age = 7;
  else if (regForm.value.categoryLevel.includes('Kelas 2')) age = 8;
  else if (regForm.value.categoryLevel.includes('Kelas 3')) age = 9;
  else if (regForm.value.categoryLevel.includes('Kelas 4')) age = 10;
  else if (regForm.value.categoryLevel.includes('Kelas 5')) age = 11;
  else if (regForm.value.categoryLevel.includes('Kelas 6')) age = 12;
  else if (regForm.value.categoryLevel.includes('SMP')) age = 14;
  else if (regForm.value.categoryLevel.includes('SMA')) age = 17;
  else if (regForm.value.categoryLevel.includes('Dewasa')) age = 25;

  const res = store.registerParticipant({
    name: regForm.value.name,
    age: age,
    categoryLevel: regForm.value.categoryLevel,
    gender: 'L',
    whatsapp: regForm.value.phone,
    address: `RT ${regForm.value.rt}`
  }, [comp.id]);

  Swal.fire({
    icon: 'success',
    title: 'Peserta Berhasil Didaftarkan!',
    text: `${res.participant.name} terdaftar pada ${comp.name} (${regForm.value.categoryLevel}).`,
    confirmButtonColor: '#059669'
  });

  regForm.value.name = '';
  regForm.value.phone = '';
}

// TAB 4: Rundown
function updateRundownStatus(item: unknown, newStatus: 'Belum Mulai' | 'Sedang Berlangsung' | 'Selesai') {
  const i = item as { id: string; activity: string; status: string };
  i.status = newStatus;
  store.saveAll();
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `Status: ${newStatus}`,
    text: i.activity,
    showConfirmButton: false,
    timer: 1500
  });
}
</script>
