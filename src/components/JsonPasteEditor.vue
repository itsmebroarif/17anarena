<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold shadow-xs">
          <i class="bi bi-code-square"></i>
        </div>
        <div>
          <h2 class="font-extrabold text-base text-slate-900 flex items-center gap-2">
            3. Paste & Validasi JSON (Direct Code Editor)
          </h2>
          <p class="text-xs text-slate-500">
            Tempelkan (paste) teks JSON backup untuk mengecek syntax, baris error, pratinjau data, dan restore data.
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="loadLiveData"
          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          title="Muat data database lokal saat ini sebagai contoh JSON"
        >
          <i class="bi bi-box-arrow-in-down text-purple-600"></i>
          <span>Load Live Data</span>
        </button>

        <button
          @click="prettifyJson"
          :disabled="!jsonInput.trim()"
          class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors border border-purple-200 disabled:opacity-40 flex items-center gap-1.5"
          title="Format dan rapikan tata letak JSON (Indent 2)"
        >
          <i class="bi bi-magic"></i>
          <span>Rapikan / Prettify</span>
        </button>

        <button
          @click="validateNow"
          class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <i class="bi bi-search"></i>
          <span>Cek & Validasi JSON</span>
        </button>

        <button
          v-if="jsonInput.trim()"
          @click="clearEditor"
          class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors"
          title="Bersihkan Editor"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Toggle View Mode Tabs -->
    <div class="flex items-center justify-between text-xs font-bold bg-slate-100 p-1 rounded-2xl">
      <button
        @click="activeTab = 'editor'"
        :class="activeTab === 'editor' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        class="flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <i class="bi bi-pencil-square"></i>
        <span>Mode Edit & Paste Teks</span>
      </button>

      <button
        @click="activeTab = 'viewer'"
        :class="activeTab === 'viewer' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        class="flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <i class="bi bi-file-earmark-code"></i>
        <span>Mode Syntax Highlight Viewer</span>
        <span v-if="validationResult && !validationResult.isValid" class="px-1.5 py-0.5 text-[10px] bg-rose-600 text-white rounded-md font-mono">
          Error Baris {{ validationResult.errorLine }}
        </span>
      </button>
    </div>

    <!-- TAB 1: Editor Input (Textarea with line numbers) -->
    <div v-show="activeTab === 'editor'" class="relative rounded-2xl border border-slate-300 overflow-hidden bg-slate-950 text-slate-100 focus-within:ring-2 focus-within:ring-purple-500">
      <div class="flex">
        <!-- Line Numbers Column -->
        <div class="bg-slate-900 text-slate-500 select-none font-mono text-xs p-3 text-right border-r border-slate-800 min-w-[3.5rem]">
          <div v-for="n in lineCount" :key="n" :class="{ 'text-rose-400 font-bold bg-rose-950/60 px-1 rounded': validationResult && !validationResult.isValid && validationResult.errorLine === n }">
            {{ n }}
          </div>
        </div>

        <!-- Textarea -->
        <textarea
          v-model="jsonInput"
          @input="handleInput"
          placeholder="Tempelkan (Paste) teks JSON di sini..."
          rows="14"
          spellcheck="false"
          class="w-full bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm p-3 focus:outline-none resize-y leading-relaxed tracking-wide placeholder-slate-600"
        ></textarea>
      </div>
      <div class="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Total {{ lineCount }} Baris | {{ jsonInput.length.toLocaleString() }} Karakter</span>
        <span v-if="validationResult?.isValid" class="text-emerald-400 font-bold flex items-center gap-1">
          <i class="bi bi-check-circle-fill"></i> Syntax JSON Valid
        </span>
        <span v-else-if="validationResult && !validationResult.isValid" class="text-rose-400 font-bold flex items-center gap-1">
          <i class="bi bi-exclamation-triangle-fill"></i> Error pada Baris {{ validationResult.errorLine }}
        </span>
      </div>
    </div>

    <!-- TAB 2: Syntax Highlighted Viewer -->
    <div v-show="activeTab === 'viewer'" class="rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden font-mono text-xs sm:text-sm">
      <div v-if="!jsonInput.trim()" class="p-12 text-center text-slate-500 space-y-2">
        <i class="bi bi-code-slash text-4xl block"></i>
        <p>Belum ada teks JSON yang ditempelkan. Silakan pindah ke tab "Mode Edit & Paste Teks".</p>
      </div>

      <div v-else class="max-h-[500px] overflow-auto p-2">
        <div
          v-for="(line, idx) in formattedLines"
          :key="idx"
          :class="[
            'flex items-start font-mono leading-relaxed px-2 py-0.5 rounded transition-colors',
            (idx + 1) === validationResult?.errorLine && !validationResult?.isValid
              ? 'bg-rose-950/80 border-l-4 border-rose-500 text-white font-bold ring-1 ring-rose-500/50 my-1'
              : 'hover:bg-slate-900/50'
          ]"
        >
          <!-- Line number -->
          <span
            :class="[
              'min-w-[3rem] text-right pr-3 select-none text-[11px]',
              (idx + 1) === validationResult?.errorLine && !validationResult?.isValid
                ? 'text-rose-400 font-extrabold'
                : 'text-slate-600'
            ]"
          >
            {{ idx + 1 }}
          </span>

          <!-- Error badge inline -->
          <span
            v-if="(idx + 1) === validationResult?.errorLine && !validationResult?.isValid"
            class="mr-2 px-1.5 py-0.2 bg-rose-600 text-white font-extrabold text-[10px] rounded shrink-0 self-center"
          >
            ⚠️ ERROR SINI
          </span>

          <!-- Highlighted HTML line -->
          <span class="whitespace-pre-wrap break-all" v-html="line.html"></span>
        </div>
      </div>
    </div>

    <!-- ERROR DISPLAY BOX (When JSON validation fails) -->
    <div
      v-if="validationResult && !validationResult.isValid"
      class="bg-rose-50 border-2 border-rose-500/80 p-4 sm:p-5 rounded-2xl text-rose-950 space-y-3 shadow-sm animate-fade-in"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-md shadow-rose-500/30">
            <i class="bi bi-x-octagon-fill"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-sm sm:text-base text-rose-900">
              Gagal Parse JSON: Syntax Error Ditemukan!
            </h3>
            <p class="text-xs font-mono font-bold text-rose-700">
              Lokasi Kesalahan: Baris {{ validationResult.errorLine }}, Kolom {{ validationResult.errorColumn }}
            </p>
          </div>
        </div>

        <button
          @click="jumpToError"
          class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <i class="bi bi-eye-fill"></i>
          <span>Lihat di Code Viewer</span>
        </button>
      </div>

      <!-- Error Message Details -->
      <div class="bg-white border border-rose-200 p-3 rounded-xl font-mono text-xs text-rose-900 space-y-1">
        <div class="font-bold text-rose-800">Detail Pesan Error:</div>
        <div class="bg-rose-100/70 p-2 rounded text-rose-950 font-semibold break-all">
          {{ validationResult.errorMessage }}
        </div>
        <div v-if="validationResult.errorSnippet" class="pt-2">
          <span class="text-slate-500 text-[11px] block mb-0.5">Potongan Teks pada Baris {{ validationResult.errorLine }}:</span>
          <code class="bg-slate-900 text-rose-300 px-2 py-1 rounded block text-xs font-mono overflow-x-auto">
            {{ validationResult.errorSnippet }}
          </code>
        </div>
      </div>

      <!-- Troubleshooting Hints -->
      <div class="text-xs text-rose-800 flex items-start gap-2 bg-rose-100/50 p-2.5 rounded-xl border border-rose-200/60">
        <i class="bi bi-info-circle-fill text-rose-600 text-sm shrink-0"></i>
        <span>
          <strong>Petunjuk Perbaikan:</strong> Pastikan tidak ada koma berlebih di akhir objek/array (contoh: <code>{"a": 1,}</code> ❌), tanda petik satu diganti petik dua (<code>"key"</code> ✅), dan seluruh kurung kurawal/siku tertutup sempurna.
        </span>
      </div>
    </div>

    <!-- VALID JSON DATA PREVIEW & RESTORE OPTIONS (When JSON is valid) -->
    <div
      v-if="validationResult && validationResult.isValid"
      class="bg-emerald-50 border-2 border-emerald-500/80 p-5 rounded-2xl text-emerald-950 space-y-4 shadow-sm animate-fade-in"
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-md shadow-emerald-500/30">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div>
          <h3 class="font-extrabold text-base text-emerald-950">
            JSON Valid! Data Siap Di-Restore
          </h3>
          <p class="text-xs text-emerald-800 font-medium">
            Struktur data berhasil dibaca dan diverifikasi. Silakan periksa pratinjau di bawah sebelum melakukan restore.
          </p>
        </div>
      </div>

      <!-- Preview Summary Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-white p-4 rounded-xl border border-emerald-200">
        <div class="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
          <span class="text-[10px] text-slate-500 font-bold uppercase block">Nama Event</span>
          <span class="font-extrabold text-xs text-slate-900 truncate block" :title="previewSummary.eventName">
            {{ previewSummary.eventName }}
          </span>
        </div>

        <div class="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
          <span class="text-[10px] text-slate-500 font-bold uppercase block">Cabang Lomba</span>
          <span class="font-extrabold text-base text-emerald-700 block">
            {{ previewSummary.competitionsCount }}
          </span>
        </div>

        <div class="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
          <span class="text-[10px] text-slate-500 font-bold uppercase block">Total Peserta</span>
          <span class="font-extrabold text-base text-emerald-700 block">
            {{ previewSummary.participantsCount }}
          </span>
        </div>

        <div class="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
          <span class="text-[10px] text-slate-500 font-bold uppercase block">Pendaftaran</span>
          <span class="font-extrabold text-base text-emerald-700 block">
            {{ previewSummary.registrationsCount }}
          </span>
        </div>

        <div class="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
          <span class="text-[10px] text-slate-500 font-bold uppercase block">Data Juara</span>
          <span class="font-extrabold text-base text-emerald-700 block">
            {{ previewSummary.winnersCount }}
          </span>
        </div>

        <div class="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
          <span class="text-[10px] text-slate-500 font-bold uppercase block">Susunan Panitia</span>
          <span class="font-extrabold text-base text-emerald-700 block">
            {{ previewSummary.committeesCount }}
          </span>
        </div>
      </div>

      <!-- Restore Strategy Option -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div class="space-y-1">
          <label class="text-xs font-extrabold text-slate-900 block">Pilih Mode Restore Data:</label>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input type="radio" v-model="restoreMode" value="overwrite" class="text-emerald-600 focus:ring-emerald-500" />
              <span>Timpa Seluruh Data (Overwrite)</span>
            </label>
            <label class="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input type="radio" v-model="restoreMode" value="merge" class="text-indigo-600 focus:ring-indigo-500" />
              <span>Gabungkan Data (Merge)</span>
            </label>
          </div>
        </div>

        <button
          @click="confirmAndRestore"
          class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <i class="bi bi-box-arrow-in-down-left text-lg"></i>
          <span>Proses Restore Data Sekarang</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { StorageService } from '../services/storage';
import { validateJsonString, highlightJsonLine, type JsonValidationResult } from '../utils/jsonValidator';
import Swal from 'sweetalert2';

const store = useArenaStore();

const jsonInput = ref('');
const activeTab = ref<'editor' | 'viewer'>('editor');
const validationResult = ref<JsonValidationResult | null>(null);
const restoreMode = ref<'overwrite' | 'merge'>('overwrite');

const lineCount = computed(() => {
  if (!jsonInput.value) return 1;
  return jsonInput.value.split('\n').length;
});

const formattedLines = computed(() => {
  if (!jsonInput.value) return [];
  const rawLines = jsonInput.value.split('\n');
  return rawLines.map(line => ({
    raw: line,
    html: highlightJsonLine(line)
  }));
});

const previewSummary = computed(() => {
  const data = validationResult.value?.parsedData;
  if (!data || typeof data !== 'object') {
    return {
      eventName: 'N/A',
      competitionsCount: 0,
      participantsCount: 0,
      registrationsCount: 0,
      winnersCount: 0,
      committeesCount: 0
    };
  }

  return {
    eventName: data.settings?.eventName || '17an Arena',
    competitionsCount: Array.isArray(data.competitions) ? data.competitions.length : 0,
    participantsCount: Array.isArray(data.participants) ? data.participants.length : 0,
    registrationsCount: Array.isArray(data.registrations) ? data.registrations.length : 0,
    winnersCount: Array.isArray(data.winners) ? data.winners.length : 0,
    committeesCount: Array.isArray(data.committees) ? data.committees.length : 0
  };
});

function handleInput() {
  // Clear result on new typing until validated, or auto-validate if already tested
  if (validationResult.value) {
    validationResult.value = null;
  }
}

function loadLiveData() {
  const data = StorageService.getAllData();
  jsonInput.value = JSON.stringify(data, null, 2);
  validateNow();
  Swal.fire({
    icon: 'success',
    title: 'Data Live Ditempelkan!',
    text: 'Teks JSON dari database lokal saat ini telah dimuat ke dalam editor.',
    timer: 1500,
    showConfirmButton: false
  });
}

function prettifyJson() {
  if (!jsonInput.value.trim()) return;
  const result = validateJsonString(jsonInput.value);
  if (result.isValid && result.parsedData) {
    jsonInput.value = JSON.stringify(result.parsedData, null, 2);
    validationResult.value = validateJsonString(jsonInput.value);
    Swal.fire({
      icon: 'success',
      title: 'JSON Berhasil Dirapikan!',
      timer: 1200,
      showConfirmButton: false
    });
  } else {
    validationResult.value = result;
    Swal.fire({
      icon: 'error',
      title: 'Gagal Merapikan JSON',
      text: `Syntax Error pada Baris ${result.errorLine}: ${result.errorMessage}`
    });
  }
}

function validateNow() {
  validationResult.value = validateJsonString(jsonInput.value);
  if (validationResult.value.isValid) {
    Swal.fire({
      icon: 'success',
      title: 'JSON Valid!',
      text: 'Struktur JSON dapat dibaca dengan baik. Silakan periksa detail pratinjau di bawah.',
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    activeTab.value = 'viewer'; // Switch to viewer to highlight error line
  }
}

function jumpToError() {
  activeTab.value = 'viewer';
}

function clearEditor() {
  jsonInput.value = '';
  validationResult.value = null;
}

function confirmAndRestore() {
  if (!validationResult.value?.isValid || !validationResult.value.parsedData) return;

  const data = validationResult.value.parsedData;
  const modeText = restoreMode.value === 'overwrite'
    ? 'MENIMPA seluruh data lokal yang ada saat ini.'
    : 'MENGGABUNGKAN data baru ke dalam database lokal.';

  Swal.fire({
    title: 'Konfirmasi Restore Data',
    html: `Apakah Anda yakin ingin memproses restore data ini?<br/><span class="text-xs text-rose-600 font-bold">${modeText}</span>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Restore Sekarang!',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      try {
        if (restoreMode.value === 'overwrite') {
          StorageService.restoreAllData(data);
        } else {
          mergeData(data);
        }

        store.init();
        Swal.fire({
          icon: 'success',
          title: 'Data Berhasil Dipulihkan!',
          text: 'Seluruh sistem dan database lokal telah diperbarui.',
          confirmButtonColor: '#059669'
        });
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Restore Data',
          text: err.message || 'Terjadi kesalahan saat memulihkan data.'
        });
      }
    }
  });
}

function mergeData(data: any) {
  const current = StorageService.getAllData();

  const mergeArray = <T extends { id: string }>(arr1: T[] = [], arr2: T[] = []): T[] => {
    const map = new Map<string, T>();
    arr1.forEach(item => map.set(item.id, item));
    arr2.forEach(item => map.set(item.id, item));
    return Array.from(map.values());
  };

  const merged = {
    competitions: mergeArray(current.competitions, data.competitions),
    participants: mergeArray(current.participants, data.participants),
    registrations: mergeArray(current.registrations, data.registrations),
    scores: mergeArray(current.scores, data.scores),
    winners: mergeArray(current.winners, data.winners),
    certificates: mergeArray(current.certificates, data.certificates),
    doorprizes: mergeArray(current.doorprizes, data.doorprizes),
    committees: mergeArray(current.committees, data.committees),
    settings: { ...current.settings, ...data.settings },
    waTemplates: data.waTemplates || current.waTemplates,
    history: current.history
  };

  StorageService.restoreAllData(merged);
}
</script>
