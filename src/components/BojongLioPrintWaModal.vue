<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:static">
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
      
      <!-- Modal Header (Hidden on Print) -->
      <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-xl font-black shadow-inner">
            🇮🇩
          </div>
          <div>
            <h3 class="font-extrabold text-base text-white flex items-center gap-2">
              Formulir A4 Lomba 17-an Bojong Lio
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-red-500/30 text-red-200 border border-red-400/40 font-mono">
                17 AGUSTUS 2026
              </span>
            </h3>
            <p class="text-xs text-slate-300">
              Formulir cetak A4 resmi untuk pencatatan juri & kirim rekap via WhatsApp ke Panitia / Warga.
            </p>
          </div>
        </div>

        <button
          @click="closeModal"
          class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Action Control Toolbar (Hidden on Print) -->
      <div class="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden text-xs">
        <!-- Target WA Number Input -->
        <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300">
          <i class="bi bi-whatsapp text-emerald-600 font-bold"></i>
          <span class="font-bold text-slate-700">No. WA Tujuan:</span>
          <input
            v-model="targetPhone"
            type="text"
            placeholder="0812xxxxxx (Grup / Panitia)"
            class="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs w-36 sm:w-44 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- WhatsApp Broadcast Button -->
          <button
            @click="sendWaRekap"
            class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i class="bi bi-send-fill"></i>
            <span>Kirim Rekap WA</span>
          </button>

          <!-- Copy Text Button -->
          <button
            @click="copyWaText"
            class="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i class="bi bi-clipboard-check"></i>
            <span>Salin Teks WA</span>
          </button>

          <!-- Print A4 Button -->
          <button
            @click="triggerPrint"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i class="bi bi-printer-fill"></i>
            <span>Cetak Form A4</span>
          </button>
        </div>
      </div>

      <!-- Modal Body / Printable Document Canvas -->
      <div class="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-50 print:bg-white print:p-0">
        <div class="a4-printable-document bg-white text-slate-900 font-sans p-8 sm:p-10 max-w-4xl mx-auto shadow-xl border border-slate-200 rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:rounded-none">
          
          <!-- KOP SURAT BOJONG LIO -->
          <div class="border-b-4 border-slate-900 pb-3 mb-6 flex items-center justify-between gap-4 border-double">
            <div class="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-3xl shrink-0 shadow-sm print:shadow-none">
              🇮🇩
            </div>

            <div class="text-center flex-1 space-y-0.5">
              <h3 class="font-black text-xs tracking-widest text-red-600 uppercase">
                PANITIA PELAKSANA PERINGATAN HUT KEMERDEKAAN RI KE-81
              </h3>
              <h1 class="font-black text-lg sm:text-2xl text-slate-900 tracking-wide uppercase">
                BOJONG LIO 17 AGUSTUS 2026
              </h1>
              <p class="text-xs font-bold text-slate-800">
                RT 05 / RW 02 — KELURAHAN BOJONG LIO
              </p>
              <p class="text-[10px] text-slate-500 italic">
                Sekretariat: Lapangan Utama Bojong Lio | Kontak Panitia: {{ store.settings.mcPhoneNumber || '0812-3456-7890' }}
              </p>
            </div>

            <div class="w-16 h-16 rounded-2xl border-2 border-red-600/40 bg-red-50 text-red-700 flex flex-col items-center justify-center shrink-0">
              <span class="font-black text-[10px] tracking-tighter">BOJONG LIO</span>
              <span class="font-black text-xl leading-none">2026</span>
            </div>
          </div>

          <!-- DOKUMEN TITLE -->
          <div class="text-center mb-6">
            <h2 class="font-black text-base sm:text-lg text-slate-900 uppercase underline decoration-2 underline-offset-4">
              FORMULIR CATATAN RESMI & DOKUMEN JURI LAPANGAN
            </h2>
            <p class="text-xs font-extrabold text-slate-700 mt-1">
              FIX DAFTAR LOMBA 17 AGUSTUS 2026 | BOJONG LIO
            </p>
            <p class="text-[10px] text-slate-400 mt-0.5 font-mono">
              Dokumen ID: BOJONG-LIO/A4/17AN-2026 | Dicetak: {{ formattedDate }}
            </p>
          </div>

          <!-- TABEL FIX LOMBA BOJONG LIO -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-black text-xs uppercase text-slate-800 flex items-center gap-1.5">
                <i class="bi bi-list-check text-red-600"></i> Rekapitulasi Jenis & Kategori Lomba Bojong Lio
              </h3>
              <span class="text-[10px] text-slate-500 italic print:hidden">
                (Dapat diisi langsung di layar sebelum dicetak)
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse border border-slate-300 text-xs text-left">
                <thead>
                  <tr class="bg-slate-100 text-slate-800 font-black uppercase text-[11px] border-b-2 border-slate-300">
                    <th class="p-2.5 border border-slate-300 w-8 text-center">No</th>
                    <th class="p-2.5 border border-slate-300 min-w-[170px]">Nama Lomba</th>
                    <th class="p-2.5 border border-slate-300 w-28 text-center">Kategori</th>
                    <th class="p-2.5 border border-slate-300 min-w-[150px]">Jenis & Kuota</th>
                    <th class="p-2.5 border border-slate-300 min-w-[130px]">Waktu & Lokasi</th>
                    <th class="p-2.5 border border-slate-300 min-w-[160px]">Catatan Juri / Pemenang</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(comp, idx) in store.competitions"
                    :key="comp.id"
                    class="hover:bg-slate-50 border-b border-slate-200"
                  >
                    <!-- No -->
                    <td class="p-2.5 border border-slate-300 text-center font-bold">
                      {{ idx + 1 }}
                    </td>

                    <!-- Nama Lomba -->
                    <td class="p-2.5 border border-slate-300 font-extrabold text-slate-900">
                      {{ comp.name }}
                      <span class="block text-[10px] text-slate-500 font-normal">
                        {{ comp.description }}
                      </span>
                    </td>

                    <!-- Kategori -->
                    <td class="p-2.5 border border-slate-300 text-center font-bold">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border"
                        :class="comp.category === 'Anak-anak' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-100 text-blue-900 border-blue-300'"
                      >
                        {{ comp.category }}
                      </span>
                    </td>

                    <!-- Jenis Lomba -->
                    <td class="p-2.5 border border-slate-300 font-bold text-slate-800">
                      <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                        {{ comp.competitionType || (comp.name.includes('Bola') ? 'Tim | 12 Orang' : comp.name.includes('Suap') ? 'Tim | 2 Orang' : comp.name.includes('Tambang') ? 'Tim | 5 Orang' : 'Individu') }}
                      </span>
                    </td>

                    <!-- Lokasi & Waktu -->
                    <td class="p-2.5 border border-slate-300 font-medium text-slate-700 text-[11px]">
                      <div><i class="bi bi-clock-fill text-amber-600"></i> {{ comp.time || '08:00 WIB' }}</div>
                      <div class="text-[10px] text-slate-500"><i class="bi bi-geo-alt-fill text-red-600"></i> {{ comp.location || 'Bojong Lio' }}</div>
                    </td>

                    <!-- Catatan / Pemenang -->
                    <td class="p-2 border border-slate-300 text-slate-800">
                      <div class="space-y-1 text-[11px]">
                        <div class="flex items-center gap-1 font-bold text-amber-700">
                          <span>🥇 1:</span>
                          <input
                            v-model="customWinnerInputs[comp.id + '_1']"
                            type="text"
                            placeholder="................................"
                            class="w-full bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-red-500 font-semibold px-1"
                          />
                        </div>
                        <div class="flex items-center gap-1 font-bold text-slate-600">
                          <span>🥈 2:</span>
                          <input
                            v-model="customWinnerInputs[comp.id + '_2']"
                            type="text"
                            placeholder="................................"
                            class="w-full bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-red-500 font-semibold px-1"
                          />
                        </div>
                        <div class="flex items-center gap-1 font-bold text-amber-900">
                          <span>🥉 3:</span>
                          <input
                            v-model="customWinnerInputs[comp.id + '_3']"
                            type="text"
                            placeholder="................................"
                            class="w-full bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-red-500 font-semibold px-1"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- LEMBAR CATATAN MANUAL LAPANGAN JURI -->
          <div class="mb-8 pt-4 border-t-2 border-dashed border-slate-300">
            <h3 class="font-black text-xs uppercase text-slate-800 mb-2 flex items-center justify-between">
              <span><i class="bi bi-pencil-square text-indigo-600"></i> Lembar Catatan Tambahan Juri Lapangan (Manual/Pen)</span>
              <span class="text-[10px] text-slate-400 font-normal">HUT RI 81 Bojong Lio</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Grid Left -->
              <div class="border border-slate-300 p-3 rounded-xl bg-slate-50/50 space-y-2">
                <p class="font-bold text-[11px] text-slate-700 border-b border-slate-200 pb-1">
                  Pencatatan Nilai / Waktu Lomba Individu:
                </p>
                <div v-for="i in 5" :key="'inv_'+i" class="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{{ i }}.</span>
                  <div class="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                  <div class="w-20 border-b border-dotted border-slate-400 h-4"></div>
                </div>
              </div>

              <!-- Grid Right -->
              <div class="border border-slate-300 p-3 rounded-xl bg-slate-50/50 space-y-2">
                <p class="font-bold text-[11px] text-slate-700 border-b border-slate-200 pb-1">
                  Pencatatan Babak Cup / Tim (Bola / Tarik Tambang):
                </p>
                <div v-for="i in 5" :key="'tm_'+i" class="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{{ i }}.</span>
                  <div class="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                  <div class="w-20 border-b border-dotted border-slate-400 h-4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- TANDA TANGAN PENGESAHAN -->
          <div class="signature-section pt-4 border-t border-slate-300 page-break-inside-avoid">
            <div class="flex items-center justify-between text-xs text-slate-800 font-medium px-2">
              <div class="text-center space-y-1 min-w-[180px]">
                <p class="font-bold text-slate-600 text-[11px]">Mengetahui,</p>
                <p class="font-black text-slate-900 uppercase text-xs">Ketua RT 05 Bojong Lio</p>

                <div class="h-16 flex items-center justify-center">
                  <div class="text-[10px] text-slate-300 italic print:hidden">
                    (Tanda Tangan & Cap)
                  </div>
                </div>

                <p class="font-extrabold text-slate-900 underline text-xs">
                  ( .................................................. )
                </p>
              </div>

              <div class="text-center text-[10px] text-slate-500 italic">
                <p class="font-bold text-slate-800">Bojong Lio, 17 Agustus 2026</p>
                <p>Panitia Peringatan HUT RI Ke-81</p>
                <div class="w-14 h-14 rounded-full border border-red-500/30 mx-auto mt-1 flex items-center justify-center text-red-500 font-bold text-[8px] uppercase tracking-tighter">
                  BOJONG LIO
                </div>
              </div>

              <div class="text-center space-y-1 min-w-[180px]">
                <p class="font-bold text-slate-600 text-[11px]">Panitia Pelaksana,</p>
                <p class="font-black text-slate-900 uppercase text-xs">Ketua Panitia 17-an</p>

                <div class="h-16 flex items-center justify-center">
                  <div class="text-[10px] text-slate-300 italic print:hidden">
                    (Tanda Tangan Panitia)
                  </div>
                </div>

                <p class="font-extrabold text-slate-900 underline text-xs">
                  ( {{ store.settings.headOfCommittee || 'Panitia Bojong Lio' }} )
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import Swal from 'sweetalert2';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useArenaStore();
const targetPhone = ref('');
const customWinnerInputs = reactive<Record<string, string>>({});

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

function closeModal() {
  emit('close');
}

function generateWaRekapMessage(): string {
  let msg = `📋 *FIX LOMBA 17 AGUSTUS 2026 | BOJONG LIO*\n`;
  msg += `----------------------------------------\n`;
  msg += `🇮🇩 *Panitia Pelaksana HUT RI Ke-81 Bojong Lio*\n\n`;

  const anakList = store.competitions.filter(c => c.category === 'Anak-anak');
  const dewasaList = store.competitions.filter(c => c.category === 'Dewasa');

  if (anakList.length > 0) {
    msg += `👶 *KATEGORI ANAK-ANAK:*\n`;
    anakList.forEach((c, i) => {
      const typeStr = c.competitionType || (c.name.includes('Bola') ? 'Tim | 12 Orang (4v4 2 Tim Cup)' : 'Individu');
      msg += `${i + 1}. *${c.name}* [${typeStr}]\n   ⏰ ${c.time || '08:00 WIB'} | 📍 ${c.location || 'Bojong Lio'}\n`;
    });
    msg += `\n`;
  }

  if (dewasaList.length > 0) {
    msg += `👨 *KATEGORI DEWASA:*\n`;
    dewasaList.forEach((c, i) => {
      const typeStr = c.competitionType || (c.name.includes('Suap') ? 'Tim | 2 Orang' : c.name.includes('Tambang') ? 'Tim | 5 Orang' : 'Individu');
      msg += `${i + 1}. *${c.name}* [${typeStr}]\n   ⏰ ${c.time || '13:30 WIB'} | 📍 ${c.location || 'Bojong Lio'}\n`;
    });
    msg += `\n`;
  }

  msg += `----------------------------------------\n`;
  msg += `_Semangat Kemerdekaan! Mohon seluruh peserta bersiap 15 menit sebelum acara dimulai. Merdeka! ✊🇮🇩_`;
  return msg;
}

function sendWaRekap() {
  const message = generateWaRekapMessage();
  let phone = targetPhone.value.trim();
  
  if (!phone && store.settings.mcPhoneNumber) {
    phone = store.settings.mcPhoneNumber;
  }

  if (!phone) {
    Swal.fire({
      title: 'Nomor WhatsApp Tujuan',
      text: 'Masukkan nomor WhatsApp penerima (misal 0812xxxx):',
      input: 'text',
      inputPlaceholder: '081234567890',
      showCancelButton: true,
      confirmButtonText: 'Kirim via WA',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#059669'
    }).then(res => {
      if (res.isConfirmed && res.value) {
        targetPhone.value = res.value;
        openWa(res.value, message);
      }
    });

  } else {
    openWa(phone, message);
  }
}

function openWa(phone: string, text: string) {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function copyWaText() {
  const message = generateWaRekapMessage();
  navigator.clipboard.writeText(message).then(() => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Teks Rekap Lomba Disalin!',
      showConfirmButton: false,
      timer: 2000
    });
  });
}

function triggerPrint() {
  window.print();
}
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .a4-printable-document, .a4-printable-document * {
    visibility: visible;
  }
  .a4-printable-document {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
