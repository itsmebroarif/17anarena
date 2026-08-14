<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="p-4 bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 flex items-center justify-center text-xl font-black border border-white/20">
            <i class="bi bi-mic-fill"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-sm tracking-tight">Kirim WhatsApp ke MC / Pembawa Acara</h3>
            <p class="text-[11px] text-red-100">Kirim instruksi, panggilan peserta, atau pengumuman pemenang</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <i class="bi bi-x-lg text-sm"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 space-y-4 overflow-y-auto text-xs">
        <!-- MC Phone Number Section -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <div class="flex items-center justify-between">
            <label class="font-extrabold text-slate-800 flex items-center gap-1.5">
              <i class="bi bi-whatsapp text-emerald-600 text-sm"></i>
              <span>Pilih MC Event / Pemandu Acara:</span>
            </label>

            <!-- Auto detect button -->
            <button
              v-if="detectedMcFromCommittee"
              @click="useDetectedMc"
              class="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
            >
              <i class="bi bi-magic"></i>
              <span>Pilih {{ detectedMcFromCommittee.name }} ({{ detectedMcFromCommittee.role }})</span>
            </button>
          </div>

          <!-- Committee Selector -->
          <select
            v-model="selectedMcMemberId"
            @change="onSelectMcMember"
            class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
          >
            <option value="">-- Pilih dari Panitia / Input Manual --</option>
            <option v-for="m in store.committees" :key="m.id" :value="m.id">
              {{ m.name }} — {{ m.role }} {{ m.phone ? `(${m.phone})` : '(No WA belum diisi)' }}
            </option>
          </select>

          <div class="flex items-center gap-2">
            <input
              v-model="mcPhone"
              type="tel"
              placeholder="0812xxxxxxxx"
              class="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
            />
            <button
              @click="saveMcPhone"
              class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors shrink-0"
              title="Simpan sebagai No. MC default"
            >
              Simpan No. MC
            </button>
          </div>
          <p v-if="!mcPhone" class="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>Nomor WA MC belum diisi. Pilih panitia di atas atau ketik nomor WA untuk MC acara ini.</span>
          </p>
        </div>

        <!-- Template Selector Tabs -->
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">Pilih Jenis Pesan untuk MC:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              @click="activeType = 'custom'"
              class="p-2.5 rounded-xl border text-left font-bold transition-all flex flex-col items-center text-center gap-1"
              :class="activeType === 'custom' ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
            >
              <i class="bi bi-chat-text-fill text-base"></i>
              <span>Instruksi Bebas</span>
            </button>

            <button
              @click="activeType = 'ready_call'"
              class="p-2.5 rounded-xl border text-left font-bold transition-all flex flex-col items-center text-center gap-1"
              :class="activeType === 'ready_call' ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
            >
              <i class="bi bi-megaphone-fill text-base"></i>
              <span>Panggilan Peserta</span>
            </button>

            <button
              @click="activeType = 'winner'"
              class="p-2.5 rounded-xl border text-left font-bold transition-all flex flex-col items-center text-center gap-1"
              :class="activeType === 'winner' ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
            >
              <i class="bi bi-trophy-fill text-base"></i>
              <span>Info Pemenang</span>
            </button>

            <button
              @click="activeType = 'rundown'"
              class="p-2.5 rounded-xl border text-left font-bold transition-all flex flex-col items-center text-center gap-1"
              :class="activeType === 'rundown' ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
            >
              <i class="bi bi-journal-text text-base"></i>
              <span>Rundown / Acara</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Fields Based on Type -->
        <!-- TYPE 1: Custom Message -->
        <div v-if="activeType === 'custom'" class="space-y-2">
          <label class="block font-bold text-slate-700">Isi Pesan / Instruksi Panitia:</label>
          <textarea
            v-model="customText"
            rows="3"
            placeholder="Tulis instruksi khusus untuk MC..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <!-- TYPE 2: Ready Call -->
        <div v-else-if="activeType === 'ready_call'" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilih Cabang Lomba:</label>
              <select
                v-model="selectedCompId"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
              >
                <option value="">-- Pilih Lomba --</option>
                <option v-for="c in store.competitions" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.category }})
                </option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilih Peserta Siap Tampil:</label>
              <select
                v-model="selectedRegId"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
              >
                <option value="">-- Pilih Peserta --</option>
                <option v-for="r in availableRegistrations" :key="r.id" :value="r.id">
                  {{ r.participantNumber }} - {{ store.getParticipantById(r.participantId)?.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- TYPE 3: Winner Announcement -->
        <div v-else-if="activeType === 'winner'" class="space-y-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Lomba yang Sudah Selesai:</label>
            <select
              v-model="selectedCompId"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
            >
              <option value="">-- Pilih Lomba --</option>
              <option v-for="c in store.competitions" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.category }})
              </option>
            </select>
          </div>

          <div v-if="selectedWinnerInfo.length > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
            <span class="font-extrabold text-amber-900 block">Juara Ditemukan:</span>
            <div v-for="w in selectedWinnerInfo" :key="w.rank" class="font-bold text-slate-800">
              • {{ w.rank }}: {{ w.name }} <span class="font-mono text-slate-500">({{ w.number }})</span>
            </div>
          </div>
          <p v-else-if="selectedCompId" class="text-slate-500 italic">
            Belum ada penetapan juara untuk cabang lomba ini.
          </p>
        </div>

        <!-- TYPE 4: Rundown Update -->
        <div v-else-if="activeType === 'rundown'" class="space-y-2">
          <label class="block font-bold text-slate-700">Update Rundown / Susunan Acara:</label>
          <textarea
            v-model="customText"
            rows="3"
            placeholder="E.g. Lomba Balap Karung Dewasa akan dimulai dalam 10 menit. Mohon MC mengimbau para peserta merapat ke arena..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <!-- Live Preview Box -->
        <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1.5">
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-sans border-b border-slate-800 pb-1">
            <span class="font-bold flex items-center gap-1 text-emerald-400">
              <i class="bi bi-eye-fill"></i> Preview Teks WA MC
            </span>
            <span>Target: {{ cleanPhoneNumber(mcPhone) || 'Belum diisi' }}</span>
          </div>
          <div class="whitespace-pre-wrap leading-relaxed">
            {{ generatedMessageText }}
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
        >
          Batal
        </button>

        <a
          :href="waTargetUrl"
          target="_blank"
          :class="[
            'px-5 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 text-white',
            mcPhone ? 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105' : 'bg-slate-400 cursor-not-allowed pointer-events-none'
          ]"
        >
          <i class="bi bi-whatsapp text-sm"></i>
          <span>Kirim WhatsApp ke MC</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { generateMcMessage, cleanPhoneNumber } from '../services/whatsapp';
import Swal from 'sweetalert2';

const props = defineProps<{
  isOpen: boolean;
  initialCompId?: string;
  initialRegId?: string;
}>();

defineEmits(['close']);

const store = useArenaStore();

const mcPhone = ref('');
const selectedMcMemberId = ref('');
const activeType = ref<'custom' | 'ready_call' | 'winner' | 'rundown'>('custom');
const customText = ref('');
const selectedCompId = ref('');
const selectedRegId = ref('');

watch(() => props.isOpen, (open) => {
  if (open) {
    mcPhone.value = store.settings.mcPhoneNumber || '';
    // Auto select detected MC member if matching mcPhone
    const mcMember = store.committees.find(m =>
      m.phone && m.phone === mcPhone.value
    ) || detectedMcFromCommittee.value;
    if (mcMember) {
      selectedMcMemberId.value = mcMember.id;
      if (!mcPhone.value && mcMember.phone) {
        mcPhone.value = mcMember.phone;
      }
    }

    if (props.initialCompId) {
      selectedCompId.value = props.initialCompId;
    }
    if (props.initialRegId) {
      selectedRegId.value = props.initialRegId;
      activeType.value = 'ready_call';
    }
  }
}, { immediate: true });

const detectedMcFromCommittee = computed(() => {
  return store.committees.find(m =>
    m.role.toLowerCase().includes('mc') ||
    m.role.toLowerCase().includes('host') ||
    m.role.toLowerCase().includes('pembawa acara') ||
    m.section.toLowerCase().includes('mc')
  );
});

function onSelectMcMember() {
  if (!selectedMcMemberId.value) return;
  const m = store.committees.find(item => item.id === selectedMcMemberId.value);
  if (m) {
    if (m.phone && m.phone !== '-') {
      mcPhone.value = m.phone;
      saveMcPhone();
    } else {
      Swal.fire({
        title: `Nomor WA ${m.name} Belum Ada`,
        text: `Masukkan nomor WA untuk ${m.name} (${m.role}):`,
        input: 'text',
        inputValue: '',
        inputPlaceholder: '08xxxxxxxxxx',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal'
      }).then((res) => {
        if (res.isConfirmed && res.value) {
          m.phone = res.value.trim();
          mcPhone.value = res.value.trim();
          store.updateCommitteeMember(m.id, { phone: m.phone });
          saveMcPhone();
        }
      });
    }
  }
}

function useDetectedMc() {
  if (detectedMcFromCommittee.value) {
    selectedMcMemberId.value = detectedMcFromCommittee.value.id;
    onSelectMcMember();
  }
}

function saveMcPhone() {
  if (!mcPhone.value.trim()) return;
  store.updateSettings({ mcPhoneNumber: mcPhone.value.trim() });
  Swal.fire({
    icon: 'success',
    title: 'Nomor MC Disimpan',
    text: `Nomor WA MC diatur ke ${mcPhone.value.trim()}`,
    timer: 1200,
    showConfirmButton: false
  });
}

const availableRegistrations = computed(() => {
  if (!selectedCompId.value) return store.registrations;
  return store.registrations.filter(r => r.competitionId === selectedCompId.value);
});

const selectedWinnerInfo = computed(() => {
  if (!selectedCompId.value) return [];
  const winner = store.winners.find(w => w.competitionId === selectedCompId.value);
  if (!winner) return [];

  const res: { rank: string; name: string; number: string }[] = [];
  if (winner.firstPlaceId) {
    const p = store.getParticipantById(winner.firstPlaceId);
    const r = store.registrations.find(reg => reg.participantId === winner.firstPlaceId && reg.competitionId === selectedCompId.value);
    res.push({ rank: 'Juara 1 🥇', name: p?.name || 'Peserta', number: r?.participantNumber || '-' });
  }
  if (winner.secondPlaceId) {
    const p = store.getParticipantById(winner.secondPlaceId);
    const r = store.registrations.find(reg => reg.participantId === winner.secondPlaceId && reg.competitionId === selectedCompId.value);
    res.push({ rank: 'Juara 2 🥈', name: p?.name || 'Peserta', number: r?.participantNumber || '-' });
  }
  if (winner.thirdPlaceId) {
    const p = store.getParticipantById(winner.thirdPlaceId);
    const r = store.registrations.find(reg => reg.participantId === winner.thirdPlaceId && reg.competitionId === selectedCompId.value);
    res.push({ rank: 'Juara 3 🥉', name: p?.name || 'Peserta', number: r?.participantNumber || '-' });
  }
  return res;
});

const generatedMessageText = computed(() => {
  const comp = store.getCompetitionById(selectedCompId.value);
  const reg = store.registrations.find(r => r.id === selectedRegId.value);
  const part = reg ? store.getParticipantById(reg.participantId) : undefined;

  const url = generateMcMessage(mcPhone.value || '0', activeType.value, {
    eventName: store.settings.eventName,
    customText: customText.value,
    competitionName: comp?.name,
    participantName: part?.name,
    participantNumber: reg?.participantNumber,
    winners: selectedWinnerInfo.value
  });

  try {
    const textEncoded = url.split('text=')[1];
    return textEncoded ? decodeURIComponent(textEncoded) : '';
  } catch (e) {
    return '';
  }
});

const waTargetUrl = computed(() => {
  const comp = store.getCompetitionById(selectedCompId.value);
  const reg = store.registrations.find(r => r.id === selectedRegId.value);
  const part = reg ? store.getParticipantById(reg.participantId) : undefined;

  return generateMcMessage(mcPhone.value || '', activeType.value, {
    eventName: store.settings.eventName,
    customText: customText.value,
    competitionName: comp?.name,
    participantName: part?.name,
    participantNumber: reg?.participantNumber,
    winners: selectedWinnerInfo.value
  });
});
</script>
