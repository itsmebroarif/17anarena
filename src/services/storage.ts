import {
  Competition,
  Participant,
  Registration,
  Score,
  Winner,
  Certificate,
  Doorprize,
  AppSettings,
  ActivityLog,
  WaTemplate,
  CommitteeMember,
  MoneyTransaction,
  RabItem,
  RundownItem
} from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  COMPETITIONS: '17an_competitions',
  PARTICIPANTS: '17an_participants',
  REGISTRATIONS: '17an_registrations',
  SCORES: '17an_scores',
  WINNERS: '17an_winners',
  CERTIFICATES: '17an_certificates',
  DOORPRIZES: '17an_doorprizes',
  SETTINGS: '17an_settings',
  HISTORY: '17an_history',
  WA_TEMPLATES: '17an_wa_templates',
  COMMITTEES: '17an_committees',
  MONEY_TRANSACTIONS: '17an_money_transactions',
  RAB_ITEMS: '17an_rab_items',
  RUNDOWN_ITEMS: '17an_rundown_items'
};

export const DEFAULT_SETTINGS: AppSettings = {
  eventName: 'Fix Lomba 17 Agustus 2026 | Bojong Lio',
  eventYear: 2026,
  theme: 'merah-putih',
  logoUrl: '',
  headOfCommittee: 'Panitia Bojong Lio',
  location: 'Bojong Lio',
  prefixRule: 'AUTO',
  certificateTemplateText: 'Diberikan sebagai bentuk penghargaan atas prestasi dan partisipasi aktif dalam menyemarakkan HUT Kemerdekaan Republik Indonesia di Bojong Lio.',
  autoBackup: true,
  colorTheme: '#dc2626',
  mcPhoneNumber: '',
  language: 'id'
};

export const DEFAULT_WA_TEMPLATES: WaTemplate[] = [
  {
    id: 'tpl-panggilan-1',
    title: 'Panggilan Lomba Standard',
    category: 'panggilan',
    content: 'Panggilan Peserta Lomba Kemerdekaan Bojong Lio 🇮🇩\n\nHalo {nama} (No: {nomor}), Anda dijadwalkan bertanding pada lomba *{lomba}*.\n*Lokasi Arena:* {lokasi}\n*Waktu:* {waktu}\n\nHarap segera menuju area pertandingan. Terima kasih!',
    isDefault: true
  },
  {
    id: 'tpl-pengingat-1',
    title: 'Pengingat Jadwal Lomba',
    category: 'pengingat',
    content: 'Pengingat Lomba Kemerdekaan Bojong Lio 🇮🇩\n\nHalo {nama}, diingatkan kembali bahwa lomba *{lomba}* (No: {nomor}) akan segera dimulai di *{lokasi}* pada pukul *{waktu}*.\n\nPersiapkan diri Anda dan datang tepat waktu! Merdeka! ✊',
    isDefault: true
  },
  {
    id: 'tpl-selesai-1',
    title: 'Ucapan Selesai Lomba',
    category: 'selesai',
    content: 'Terima Kasih Partisipasi Lomba! 🇮🇩\n\nHalo {nama}, terima kasih telah bertanding pada lomba *{lomba}* (No. Peserta: {nomor}). Hasil pertandingan dan penyerahan piala akan diumumkan di Panggung Utama Bojong Lio.',
    isDefault: true
  },
  {
    id: 'tpl-pengumuman-1',
    title: 'Pengumuman Juara Lomba',
    category: 'pengumuman',
    content: 'Selamat {nama}! 🏆\n\nAnda dinyatakan sebagai pemenang pada lomba *{lomba}* (No. Peserta: {nomor}) di lokasi *{lokasi}*.\n\nPenyerahan piala dan sertifikat akan dilaksanakan saat Malam Puncak Kemerdekaan Bojong Lio. Terima kasih atas partisipasi luar biasa Anda! 🇮🇩',
    isDefault: true
  }
];

export const DEFAULT_17AN_TEMPLATE_COMPETITIONS: Omit<Competition, 'id'>[] = [
  {
    name: 'Makan Krupuk',
    category: 'Anak-anak',
    competitionType: 'Individu',
    description: 'Lomba makan kerupuk gantung tanpa menyentuh dengan tangan (Individu).',
    location: 'Bojong Lio (Lapangan Utama)',
    date: '17 Agustus 2026',
    time: '08:00 WIB',
    maxParticipants: 30,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'KRPK'
  },
  {
    name: 'Ngambil Karet di Tepung',
    category: 'Anak-anak',
    competitionType: 'Individu',
    description: 'Lomba mengambil karet di dalam nampan berisi tepung menggunakan mulut (Individu).',
    location: 'Bojong Lio (Lapangan Utama)',
    date: '17 Agustus 2026',
    time: '08:45 WIB',
    maxParticipants: 30,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'KRTG'
  },
  {
    name: 'Masukin Paku Ke Botol Pake Spion',
    category: 'Anak-anak',
    competitionType: 'Individu',
    description: 'Lomba memasukkan paku terikat tali ke dalam botol dengan kaca spion (Individu).',
    location: 'Bojong Lio (Area Panggung)',
    date: '17 Agustus 2026',
    time: '09:30 WIB',
    maxParticipants: 25,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'SPON'
  },
  {
    name: 'Masukin Bendera',
    category: 'Anak-anak',
    competitionType: 'Individu',
    description: 'Lomba memindahkan bendera Merah Putih kecil ke dalam botol (Individu).',
    location: 'Bojong Lio (Lapangan Utama)',
    date: '17 Agustus 2026',
    time: '10:15 WIB',
    maxParticipants: 30,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'BNDR'
  },
  {
    name: 'Bola Kampung',
    category: 'Anak-anak',
    competitionType: 'Tim | 12 Orang (Tim Main 4 lawan 4 (2 Tim Cup))',
    description: 'Lomba sepak bola kampung (Tim 12 Orang, main 4 lawan 4).',
    location: 'Bojong Lio (Lapangan Bola)',
    date: '17 Agustus 2026',
    time: '10:45 WIB',
    maxParticipants: 48,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'BOLA'
  },
  {
    name: 'Balap Karung',
    category: 'Anak-anak',
    competitionType: 'Individu',
    description: 'Lomba balap karung tradisional anak-anak hingga garis finish (Individu).',
    location: 'Bojong Lio (Lapangan Utama)',
    date: '17 Agustus 2026',
    time: '11:30 WIB',
    maxParticipants: 30,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'KRNG'
  },
  {
    name: 'Suap Pisang',
    category: 'Dewasa',
    competitionType: 'Tim | 2 Orang',
    description: 'Lomba menyuapi pisang dengan mata tertutup berpasangan 2 orang (Dewasa).',
    location: 'Bojong Lio (Panggung Utama)',
    date: '17 Agustus 2026',
    time: '13:30 WIB',
    maxParticipants: 20,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'SPSG'
  },
  {
    name: 'Tarik Tambang',
    category: 'Dewasa',
    competitionType: 'Tim | 5 Orang',
    description: 'Lomba adu kekuatan tarik tambang antar tim (5 orang per tim - Dewasa).',
    location: 'Bojong Lio (Lapangan Utama)',
    date: '17 Agustus 2026',
    time: '15:00 WIB',
    maxParticipants: 40,
    pointFirst: 100,
    pointSecond: 75,
    pointThird: 50,
    status: 'Upcoming',
    prefix: 'TMBG'
  }
];

export const SEED_COMPETITIONS: Competition[] = [];
export const SEED_PARTICIPANTS: Participant[] = [];
export const SEED_REGISTRATIONS: Registration[] = [];
export const SEED_WINNERS: Winner[] = [];
export const SEED_DOORPRIZES: Doorprize[] = [];

export const FIX_BOJONG_LIO_COMMITTEES: CommitteeMember[] = [
  {
    id: 'cm-1',
    idCardNumber: 'PAN-001',
    name: 'Pak Bambang (RT)',
    role: 'Direktur Acara',
    section: 'Internal / RT 05',
    phone: '081234567801',
    email: 'rt05.bojonglio@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-2',
    idCardNumber: 'PAN-002',
    name: 'Arif Permana',
    role: 'Ketua Pelaksana',
    section: 'Panitia Utama',
    phone: '081234567802',
    email: 'arif.permana@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-3',
    idCardNumber: 'PAN-003',
    name: 'Naufal Daffa',
    role: 'Ketua Panitia',
    section: 'Panitia Utama',
    phone: '081234567803',
    email: 'naufal.daffa@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-4',
    idCardNumber: 'PAN-004',
    name: 'Arif Permana',
    role: 'SPV Registrasi',
    section: 'Seksi Registrasi',
    phone: '081234567802',
    email: 'arif.permana@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-5',
    idCardNumber: 'PAN-005',
    name: 'Aulia',
    role: 'Registrasi & Result Entry',
    section: 'Seksi Registrasi',
    phone: '081234567805',
    email: 'aulia@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-6',
    idCardNumber: 'PAN-006',
    name: 'Salwa',
    role: 'SPV Pengamat Acara',
    section: 'Seksi Acara',
    phone: '081234567806',
    email: 'salwa@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-7',
    idCardNumber: 'PAN-007',
    name: 'Aqila',
    role: 'MC / Co-Host',
    section: 'Seksi Acara',
    phone: '081234567807',
    email: 'aqila.mc@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-8',
    idCardNumber: 'PAN-008',
    name: 'Kevin',
    role: 'MC / Host',
    section: 'Seksi Acara',
    phone: '081234567808',
    email: 'kevin.mc@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-9',
    idCardNumber: 'PAN-009',
    name: 'Abi',
    role: 'SPV Keamanan Acara',
    section: 'Seksi Keamanan',
    phone: '081234567809',
    email: 'abi@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-10',
    idCardNumber: 'PAN-010',
    name: 'Naufal Daffa',
    role: 'Dokumentasi',
    section: 'Seksi Humas & Dok',
    phone: '081234567803',
    email: 'naufal.daffa@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-11',
    idCardNumber: 'PAN-011',
    name: 'Dilla',
    role: 'Pencatat Skor',
    section: 'Seksi Pertandingan',
    phone: '081234567811',
    email: 'dilla@gmail.com',
    rtRw: 'RT 05 / RW 02'
  },
  {
    id: 'cm-12',
    idCardNumber: 'PAN-012',
    name: 'Ario Wicaksono',
    role: 'Asset Management',
    section: 'Seksi Perlengkapan',
    phone: '081234567812',
    email: 'ario.wicaksono@gmail.com',
    rtRw: 'RT 05 / RW 02'
  }
];

export const FIX_BOJONG_LIO_RUNDOWNS: RundownItem[] = [
  {
    id: 'rdn-01',
    date: '17 Agustus 2026',
    timeStart: '08:30',
    timeEnd: '08:45',
    duration: '15 mnt',
    activity: 'Pembukaan & pengarahan',
    participants: 'Semua',
    pic: 'Kevin & Aqila (MC)',
    location: 'Panggung Utama',
    status: 'Belum Mulai',
    notes: 'MC, sambutan singkat, aturan umum'
  },
  {
    id: 'rdn-02',
    date: '17 Agustus 2026',
    timeStart: '08:45',
    timeEnd: '09:00',
    duration: '15 mnt',
    activity: 'Registrasi ulang & persiapan peserta',
    participants: 'Anak-anak',
    pic: 'Arif & Aulia (Registrasi)',
    location: 'Meja Pendaftaran',
    status: 'Belum Mulai',
    notes: 'Peserta dikumpulkan per lomba'
  },
  {
    id: 'rdn-03',
    date: '17 Agustus 2026',
    timeStart: '09:00',
    timeEnd: '09:25',
    duration: '25 mnt',
    activity: '🥨 Makan Kerupuk',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan (Dilla)',
    location: 'Arena A (Tali Kerupuk)',
    status: 'Belum Mulai',
    notes: 'Individu'
  },
  {
    id: 'rdn-04',
    date: '17 Agustus 2026',
    timeStart: '09:25',
    timeEnd: '09:50',
    duration: '25 mnt',
    activity: '🥄 Ngambil Karet di Tepung',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan',
    location: 'Arena B (Meja Tepung)',
    status: 'Belum Mulai',
    notes: 'Individu'
  },
  {
    id: 'rdn-05',
    date: '17 Agustus 2026',
    timeStart: '09:50',
    timeEnd: '10:15',
    duration: '25 mnt',
    activity: '🪞 Masukin Paku ke Botol Pakai Spion',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan',
    location: 'Arena A',
    status: 'Belum Mulai',
    notes: 'Individu'
  },
  {
    id: 'rdn-06',
    date: '17 Agustus 2026',
    timeStart: '10:15',
    timeEnd: '10:40',
    duration: '25 mnt',
    activity: '🇮🇩 Masukin Bendera',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan',
    location: 'Arena B',
    status: 'Belum Mulai',
    notes: 'Individu'
  },
  {
    id: 'rdn-07',
    date: '17 Agustus 2026',
    timeStart: '10:40',
    timeEnd: '10:55',
    duration: '15 mnt',
    activity: '☕ Istirahat / Transisi',
    participants: 'Anak-anak',
    pic: 'Salwa (SPV Acara)',
    location: 'Area Istirahat',
    status: 'Belum Mulai',
    notes: 'Persiapan lomba berikutnya'
  },
  {
    id: 'rdn-08',
    date: '17 Agustus 2026',
    timeStart: '10:55',
    timeEnd: '11:25',
    duration: '30 mnt',
    activity: '🏃 Balap Karung',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan',
    location: 'Lintasan Utama',
    status: 'Belum Mulai',
    notes: 'Individu'
  },
  {
    id: 'rdn-09',
    date: '17 Agustus 2026',
    timeStart: '11:25',
    timeEnd: '12:25',
    duration: '60 mnt',
    activity: '⚽ Bola Kampung — Babak Penyisihan',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan & Wasit',
    location: 'Lapangan Futsal / Mini',
    status: 'Belum Mulai',
    notes: 'Tim 12 orang, format pertandingan'
  },
  {
    id: 'rdn-10',
    date: '17 Agustus 2026',
    timeStart: '12:25',
    timeEnd: '13:30',
    duration: '65 mnt',
    activity: '🕌 Istirahat / Shalat / Makan',
    participants: 'Semua',
    pic: 'Abi (Keamanan) & Panitia',
    location: 'Seluruh Area',
    status: 'Belum Mulai',
    notes: 'Lapangan dikosongkan'
  },
  {
    id: 'rdn-11',
    date: '17 Agustus 2026',
    timeStart: '13:30',
    timeEnd: '13:45',
    duration: '15 mnt',
    activity: 'Persiapan sesi dewasa',
    participants: 'Dewasa',
    pic: 'Arif & Aulia (Registrasi)',
    location: 'Meja Pendaftaran',
    status: 'Belum Mulai',
    notes: 'Registrasi & briefing'
  },
  {
    id: 'rdn-12',
    date: '17 Agustus 2026',
    timeStart: '13:45',
    timeEnd: '14:15',
    duration: '30 mnt',
    activity: '🍌 Suap Pisang',
    participants: 'Dewasa',
    pic: 'Seksi Pertandingan',
    location: 'Panggung / Arena A',
    status: 'Belum Mulai',
    notes: 'Tim 2 orang'
  },
  {
    id: 'rdn-13',
    date: '17 Agustus 2026',
    timeStart: '14:15',
    timeEnd: '14:45',
    duration: '30 mnt',
    activity: '🪢 Tarik Tambang — Penyisihan',
    participants: 'Dewasa',
    pic: 'Seksi Pertandingan & Keamanan',
    location: 'Lapangan Rumput',
    status: 'Belum Mulai',
    notes: 'Tim 5 orang'
  },
  {
    id: 'rdn-14',
    date: '17 Agustus 2026',
    timeStart: '14:45',
    timeEnd: '15:15',
    duration: '30 mnt',
    activity: '⚽ Bola Kampung — Babak Lanjutan',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan & Wasit',
    location: 'Lapangan Futsal / Mini',
    status: 'Belum Mulai',
    notes: 'Semifinal / lanjutan'
  },
  {
    id: 'rdn-15',
    date: '17 Agustus 2026',
    timeStart: '15:15',
    timeEnd: '15:45',
    duration: '30 mnt',
    activity: '🪢 Tarik Tambang — Semifinal',
    participants: 'Dewasa',
    pic: 'Seksi Pertandingan & Keamanan',
    location: 'Lapangan Rumput',
    status: 'Belum Mulai',
    notes: 'Tim terbaik'
  },
  {
    id: 'rdn-16',
    date: '17 Agustus 2026',
    timeStart: '15:45',
    timeEnd: '16:15',
    duration: '30 mnt',
    activity: '⚽ Bola Kampung — Final',
    participants: 'Anak-anak',
    pic: 'Seksi Pertandingan & Wasit',
    location: 'Lapangan Futsal / Mini',
    status: 'Belum Mulai',
    notes: 'Perebutan juara'
  },
  {
    id: 'rdn-17',
    date: '17 Agustus 2026',
    timeStart: '16:15',
    timeEnd: '16:35',
    duration: '20 mnt',
    activity: '🪢 Tarik Tambang — Final',
    participants: 'Dewasa',
    pic: 'Seksi Pertandingan & Keamanan',
    location: 'Lapangan Rumput',
    status: 'Belum Mulai',
    notes: 'Perebutan juara'
  },
  {
    id: 'rdn-18',
    date: '17 Agustus 2026',
    timeStart: '16:35',
    timeEnd: '16:50',
    duration: '15 mnt',
    activity: '🏅 Rekapitulasi & validasi hasil',
    participants: 'Panitia',
    pic: 'Dilla & Aulia (Scoring)',
    location: 'Meja Panitia',
    status: 'Belum Mulai',
    notes: 'Result entry + verifikasi'
  },
  {
    id: 'rdn-19',
    date: '17 Agustus 2026',
    timeStart: '16:50',
    timeEnd: '17:05',
    duration: '15 mnt',
    activity: '🎁 Pengumuman pemenang & doorprize',
    participants: 'Semua',
    pic: 'Kevin, Aqila & Naufal Daffa',
    location: 'Panggung Utama',
    status: 'Belum Mulai',
    notes: 'Pengumuman juara'
  },
  {
    id: 'rdn-20',
    date: '17 Agustus 2026',
    timeStart: '17:05',
    timeEnd: '17:15',
    duration: '10 mnt',
    activity: '📸 Penyerahan hadiah & foto bersama',
    participants: 'Semua',
    pic: 'Pak Bambang (RT) & Naufal D. (Dok)',
    location: 'Panggung Utama',
    status: 'Belum Mulai',
    notes: 'Dokumentasi'
  },
  {
    id: 'rdn-21',
    date: '17 Agustus 2026',
    timeStart: '17:15',
    timeEnd: '17:15',
    duration: '—',
    activity: '🏁 ACARA SELESAI',
    participants: '—',
    pic: 'Panitia Utama',
    location: 'Seluruh Arena',
    status: 'Belum Mulai',
    notes: '—'
  }
];

export const FIX_BOJONG_LIO_MONEY_TRANSACTIONS: MoneyTransaction[] = [
  {
    id: 'mt-001',
    date: '2026-08-10',
    type: 'Pemasukan',
    category: 'Sumbangan / Donasi',
    description: 'Uang sumbangan (Cash)',
    amount: 1478000,
    recordedBy: 'Bendahara / Panitia',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mt-002',
    date: '2026-10-10',
    type: 'Pemasukan',
    category: 'Kas Panitia',
    description: 'Saldo Plus Kak Arif (Debit)',
    amount: 550000,
    recordedBy: 'Kak Arif',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mt-003',
    date: '2026-10-10',
    type: 'Pengeluaran',
    category: 'Konsumsi',
    description: 'Kopi Kapal Api (2 Renceng @ Rp 18.000)',
    amount: 36000,
    recordedBy: 'Seksi Konsumsi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mt-004',
    date: '2026-10-10',
    type: 'Pengeluaran',
    category: 'Konsumsi',
    description: 'Indocafe (2 Renceng @ Rp 17.500)',
    amount: 35000,
    recordedBy: 'Seksi Konsumsi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mt-005',
    date: '2026-10-10',
    type: 'Pengeluaran',
    category: 'Konsumsi',
    description: 'Biscuit Roma (2 Pack @ Rp 9.000)',
    amount: 18000,
    recordedBy: 'Seksi Konsumsi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mt-006',
    date: '2026-10-10',
    type: 'Pengeluaran',
    category: 'Konsumsi',
    description: 'Giat Gelas 220ml (5 Dus @ Rp 16.000)',
    amount: 80000,
    recordedBy: 'Seksi Konsumsi',
    createdAt: new Date().toISOString()
  }
];

export const FIX_BOJONG_LIO_RAB_ITEMS: RabItem[] = [
  {
    id: 'rab-001',
    section: 'Pemasukan Kas',
    itemName: 'Uang sumbangan',
    quantity: 1,
    unit: 'Cash',
    pricePerUnit: 2500000,
    totalEstimated: 2500000,
    realization: 1478000,
    notes: '10/8/2026 | Income | Donasi Warga & Kas Cash'
  },
  {
    id: 'rab-002',
    section: 'Pemasukan Kas',
    itemName: 'Saldo Plus Kak Arif',
    quantity: 1,
    unit: 'Debit',
    pricePerUnit: 550000,
    totalEstimated: 550000,
    realization: 550000,
    notes: '10/10/2026 | Income | Kas Debit Kak Arif'
  },
  {
    id: 'rab-003',
    section: 'Konsumsi Panitia',
    itemName: 'Kopi Kapal Api',
    quantity: 2,
    unit: 'Renceng',
    pricePerUnit: 18000,
    totalEstimated: 36000,
    realization: 36000,
    notes: '10/10/2026 | Expense | Rp 18.000/renceng'
  },
  {
    id: 'rab-004',
    section: 'Konsumsi Panitia',
    itemName: 'Indocafe',
    quantity: 2,
    unit: 'Renceng',
    pricePerUnit: 17500,
    totalEstimated: 35000,
    realization: 35000,
    notes: '10/10/2026 | Expense | Rp 17.500/renceng'
  },
  {
    id: 'rab-005',
    section: 'Konsumsi Panitia',
    itemName: 'Biscuit Roma',
    quantity: 2,
    unit: 'Pack',
    pricePerUnit: 9000,
    totalEstimated: 18000,
    realization: 18000,
    notes: '10/10/2026 | Expense | Rp 9.000/pack (Est. Rp18.000)'
  },
  {
    id: 'rab-006',
    section: 'Konsumsi Panitia',
    itemName: 'Giat Gelas 220ml',
    quantity: 5,
    unit: 'Dus',
    pricePerUnit: 16000,
    totalEstimated: 90000,
    realization: 80000,
    notes: '10/10/2026 | Expense | Rp 16.000/dus (Est. Rp90.000)'
  },
  {
    id: 'rab-007',
    section: 'Perlengkapan Lomba',
    itemName: 'Pisang',
    quantity: 1,
    unit: 'Sisir',
    pricePerUnit: 9000,
    totalEstimated: 9000,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Anak (Suap Pisang)'
  },
  {
    id: 'rab-008',
    section: 'Perlengkapan Lomba',
    itemName: 'Kerupuk',
    quantity: 30,
    unit: 'Biji',
    pricePerUnit: 533,
    totalEstimated: 16000,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Anak (Makan Kerupuk)'
  },
  {
    id: 'rab-009',
    section: 'Perlengkapan Lomba',
    itemName: 'Kelereng',
    quantity: 10,
    unit: 'Biji',
    pricePerUnit: 2000,
    totalEstimated: 20000,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Anak'
  },
  {
    id: 'rab-010',
    section: 'Perlengkapan Lomba',
    itemName: 'Sumpit',
    quantity: 10,
    unit: 'Biji',
    pricePerUnit: 50,
    totalEstimated: 500,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Anak'
  },
  {
    id: 'rab-011',
    section: 'Perlengkapan Lomba',
    itemName: 'Kain slayer',
    quantity: 4,
    unit: 'Biji',
    pricePerUnit: 125,
    totalEstimated: 500,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Dewasa'
  },
  {
    id: 'rab-012',
    section: 'Perlengkapan Lomba',
    itemName: 'Tisu Basah',
    quantity: 4,
    unit: 'Biji',
    pricePerUnit: 125,
    totalEstimated: 500,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Dewasa'
  },
  {
    id: 'rab-013',
    section: 'Kebersihan',
    itemName: 'Trashbag',
    quantity: 1,
    unit: 'Pack (isi 6)',
    pricePerUnit: 7500,
    totalEstimated: 7500,
    realization: 0,
    notes: '17/08/2026 | Planned | Kantong Sampah Lapangan'
  },
  {
    id: 'rab-014',
    section: 'Perlengkapan Lomba',
    itemName: 'Bola Plastik',
    quantity: 1,
    unit: 'Buah',
    pricePerUnit: 8000,
    totalEstimated: 8000,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Anak (Bola Kampung)'
  },
  {
    id: 'rab-015',
    section: 'Perlengkapan Lomba',
    itemName: 'Tali Rafia',
    quantity: 2,
    unit: 'Buah',
    pricePerUnit: 7500,
    totalEstimated: 15000,
    realization: 0,
    notes: '17/08/2026 | Planned | 2 Buah Tali Rafia'
  },
  {
    id: 'rab-016',
    section: 'Perlengkapan Lomba',
    itemName: 'Paku',
    quantity: 4,
    unit: 'Buah',
    pricePerUnit: 3750,
    totalEstimated: 15000,
    realization: 0,
    notes: '17/08/2026 | Planned | KASIH (ARIO)'
  },
  {
    id: 'rab-017',
    section: 'Perlengkapan Lomba',
    itemName: 'Karet',
    quantity: 1,
    unit: 'Pack',
    pricePerUnit: 10000,
    totalEstimated: 10000,
    realization: 0,
    notes: '17/08/2026 | Planned | Lomba Karet Tepung'
  },
  {
    id: 'rab-018',
    section: 'Perlengkapan Lomba',
    itemName: 'Nampan',
    quantity: 1,
    unit: 'Buah',
    pricePerUnit: 2000,
    totalEstimated: 2000,
    realization: 0,
    notes: '17/08/2026 | Planned | PINJAM/BELI'
  },
  {
    id: 'rab-019',
    section: 'Perlengkapan Lomba',
    itemName: 'Tepung Terigu',
    quantity: 1,
    unit: '1/2 KG',
    pricePerUnit: 10000,
    totalEstimated: 10000,
    realization: 0,
    notes: '17/08/2026 | Planned | 1/2 KG Tepung'
  },
  {
    id: 'rab-020',
    section: 'Dokumentasi',
    itemName: 'Kamera (GOPRO)',
    quantity: 1,
    unit: 'Unit',
    pricePerUnit: 25000,
    totalEstimated: 25000,
    realization: 0,
    notes: '17/08/2026 | Planned | PINJAM (ARIO)'
  },
  {
    id: 'rab-021',
    section: 'Dekorasi',
    itemName: 'Bendera Plastik Merah Putih',
    quantity: 1,
    unit: 'Pack',
    pricePerUnit: 15000,
    totalEstimated: 15000,
    realization: 0,
    notes: '17/08/2026 | Planned | Rp 15.000/pack'
  },
  {
    id: 'rab-022',
    section: 'Perlengkapan Lomba',
    itemName: 'Botol Kaca',
    quantity: 4,
    unit: 'Buah',
    pricePerUnit: 0,
    totalEstimated: 0,
    realization: 0,
    notes: '17/08/2026 | Planned | PINJAM (SALWA)'
  },
  {
    id: 'rab-023',
    section: 'Perlengkapan Lomba',
    itemName: 'Helm',
    quantity: 4,
    unit: 'Buah',
    pricePerUnit: 5000,
    totalEstimated: 20000,
    realization: 0,
    notes: '17/08/2026 | Planned | PINJAM (SAHA?)'
  },
  {
    id: 'rab-024',
    section: 'Perlengkapan Lomba',
    itemName: 'Tali Tambang',
    quantity: 1,
    unit: 'Roll',
    pricePerUnit: 0,
    totalEstimated: 0,
    realization: 0,
    notes: '17/08/2026 | Planned | (Di SALWA)'
  },
  {
    id: 'rab-025',
    section: 'Perlengkapan Lomba',
    itemName: 'Spion motor',
    quantity: 4,
    unit: 'Buah',
    pricePerUnit: 0,
    totalEstimated: 0,
    realization: 0,
    notes: '17/08/2026 | Planned | PINJAM (SAHA?)'
  },
  {
    id: 'rab-026',
    section: 'Perlengkapan Lomba',
    itemName: 'Bambu',
    quantity: 1,
    unit: 'Batang',
    pricePerUnit: 0,
    totalEstimated: 0,
    realization: 0,
    notes: '17/08/2026 | Planned | Rp 0'
  },
  {
    id: 'rab-028',
    section: 'Lain-lain',
    itemName: 'Cadangan Biaya Unforeseen',
    quantity: 1,
    unit: 'Paket',
    pricePerUnit: 10000,
    totalEstimated: 10000,
    realization: 0,
    notes: '17/08/2026 | Planned | ±Rp 10.000 Cadangan'
  }
];

export const DEFAULT_COMMITTEES: CommitteeMember[] = FIX_BOJONG_LIO_COMMITTEES;
export const DEFAULT_MONEY_TRANSACTIONS: MoneyTransaction[] = FIX_BOJONG_LIO_MONEY_TRANSACTIONS;
export const DEFAULT_RAB_ITEMS: RabItem[] = FIX_BOJONG_LIO_RAB_ITEMS;
export const DEFAULT_RUNDOWN_ITEMS: RundownItem[] = FIX_BOJONG_LIO_RUNDOWNS;

// LocalStorage Helper Utilities
export class StorageService {
  static get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading key ${key} from LocalStorage:`, e);
      return fallback;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting key ${key} in LocalStorage:`, e);
    }
  }

  static initializeDefaults(force = false): void {
    const isCleared = localStorage.getItem('17an_cleared_empty_fresh_v5_bojong_lio');
    if (force || !isCleared) {
      const defaultComps: Competition[] = DEFAULT_17AN_TEMPLATE_COMPETITIONS.map(c => ({
        ...c,
        id: 'comp-' + uuidv4().substring(0, 8)
      }));
      this.set(STORAGE_KEYS.COMPETITIONS, defaultComps);
      this.set(STORAGE_KEYS.PARTICIPANTS, []);
      this.set(STORAGE_KEYS.REGISTRATIONS, []);
      this.set(STORAGE_KEYS.SCORES, []);
      this.set(STORAGE_KEYS.WINNERS, []);
      this.set(STORAGE_KEYS.CERTIFICATES, []);
      this.set(STORAGE_KEYS.DOORPRIZES, []);
      this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.set(STORAGE_KEYS.HISTORY, []);
      this.set(STORAGE_KEYS.WA_TEMPLATES, DEFAULT_WA_TEMPLATES);
      this.set(STORAGE_KEYS.COMMITTEES, FIX_BOJONG_LIO_COMMITTEES);
      this.set(STORAGE_KEYS.MONEY_TRANSACTIONS, FIX_BOJONG_LIO_MONEY_TRANSACTIONS);
      this.set(STORAGE_KEYS.RAB_ITEMS, FIX_BOJONG_LIO_RAB_ITEMS);
      this.set(STORAGE_KEYS.RUNDOWN_ITEMS, FIX_BOJONG_LIO_RUNDOWNS);
      localStorage.setItem('17an_cleared_empty_fresh_v5_bojong_lio', 'true');
    }
  }

  static getAllData() {
    return {
      competitions: this.get<Competition[]>(STORAGE_KEYS.COMPETITIONS, []),
      participants: this.get<Participant[]>(STORAGE_KEYS.PARTICIPANTS, []),
      registrations: this.get<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []),
      scores: this.get<Score[]>(STORAGE_KEYS.SCORES, []),
      winners: this.get<Winner[]>(STORAGE_KEYS.WINNERS, []),
      certificates: this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []),
      doorprizes: this.get<Doorprize[]>(STORAGE_KEYS.DOORPRIZES, []),
      settings: this.get<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
      history: this.get<ActivityLog[]>(STORAGE_KEYS.HISTORY, []),
      waTemplates: this.get<WaTemplate[]>(STORAGE_KEYS.WA_TEMPLATES, DEFAULT_WA_TEMPLATES),
      committees: this.get<CommitteeMember[]>(STORAGE_KEYS.COMMITTEES, []),
      moneyTransactions: this.get<MoneyTransaction[]>(STORAGE_KEYS.MONEY_TRANSACTIONS, DEFAULT_MONEY_TRANSACTIONS),
      rabItems: this.get<RabItem[]>(STORAGE_KEYS.RAB_ITEMS, DEFAULT_RAB_ITEMS),
      rundownItems: this.get<RundownItem[]>(STORAGE_KEYS.RUNDOWN_ITEMS, DEFAULT_RUNDOWN_ITEMS)
    };
  }

  static restoreAllData(data: any) {
    if (!data) return false;
    if (data.competitions) this.set(STORAGE_KEYS.COMPETITIONS, data.competitions);
    if (data.participants) this.set(STORAGE_KEYS.PARTICIPANTS, data.participants);
    if (data.registrations) this.set(STORAGE_KEYS.REGISTRATIONS, data.registrations);
    if (data.scores) this.set(STORAGE_KEYS.SCORES, data.scores);
    if (data.winners) this.set(STORAGE_KEYS.WINNERS, data.winners);
    if (data.certificates) this.set(STORAGE_KEYS.CERTIFICATES, data.certificates);
    if (data.doorprizes) this.set(STORAGE_KEYS.DOORPRIZES, data.doorprizes);
    if (data.settings) this.set(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.history) this.set(STORAGE_KEYS.HISTORY, data.history);
    if (data.waTemplates) this.set(STORAGE_KEYS.WA_TEMPLATES, data.waTemplates);
    if (data.committees) this.set(STORAGE_KEYS.COMMITTEES, data.committees);
    if (data.moneyTransactions) this.set(STORAGE_KEYS.MONEY_TRANSACTIONS, data.moneyTransactions);
    if (data.rabItems) this.set(STORAGE_KEYS.RAB_ITEMS, data.rabItems);
    if (data.rundownItems) this.set(STORAGE_KEYS.RUNDOWN_ITEMS, data.rundownItems);
    return true;
  }
}
