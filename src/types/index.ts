export type Category = 'Anak-anak' | 'Remaja' | 'Dewasa' | 'Umum';

export type RegistrationStatus = 'Waiting' | 'Called' | 'Ready' | 'Playing' | 'Finished' | 'Disqualified';

export type CompetitionStatus = 'Upcoming' | 'Ongoing' | 'Finished';

export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: 'L' | 'P';
  whatsapp: string;
  email?: string;
  address?: string;
  notes?: string;
  categoryLevel?: string; // e.g. "Anak-anak (TK)", "Anak-anak (SD Kelas 1)", "Remaja (SMP)", "Dewasa"
  photoUrl?: string;
  createdAt: string;
}

export const AGE_CATEGORY_GROUPS = [
  {
    group: 'Anak-anak',
    icon: '👶',
    options: [
      { value: 'Anak-anak (TK)', label: 'TK' },
      { value: 'Anak-anak (SD Kelas 1)', label: 'SD Kelas 1' },
      { value: 'Anak-anak (SD Kelas 2)', label: 'SD Kelas 2' },
      { value: 'Anak-anak (SD Kelas 3)', label: 'SD Kelas 3' },
      { value: 'Anak-anak (SD Kelas 4)', label: 'SD Kelas 4' },
      { value: 'Anak-anak (SD Kelas 5)', label: 'SD Kelas 5' },
      { value: 'Anak-anak (SD Kelas 6)', label: 'SD Kelas 6' },
    ]
  },
  {
    group: 'Remaja',
    icon: '👦',
    options: [
      { value: 'Remaja (SMP)', label: 'SMP' },
      { value: 'Remaja (SMA)', label: 'SMA' }
    ]
  },
  {
    group: 'Dewasa',
    icon: '👨',
    options: [
      { value: 'Dewasa', label: 'Dewasa' }
    ]
  }
];

export interface Competition {
  id: string;
  name: string;
  category: Category;
  description: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
  thumbnailUrl?: string;
  pointFirst: number;
  pointSecond: number;
  pointThird: number;
  status: CompetitionStatus;
  prefix: string;
  competitionType?: string; // e.g. "Individu", "Tim | 2 Orang", "Tim | 5 Orang", "Tim | 12 Orang"
}

export interface Registration {
  id: string;
  participantId: string;
  competitionId: string;
  participantNumber: string; // e.g., BK-001
  status: RegistrationStatus;
  registeredAt: string;
}

export interface Score {
  id: string;
  competitionId: string;
  participantId: string;
  judgeName: string;
  score: number;
  notes?: string;
  round?: string;
  createdAt: string;
}

export interface Winner {
  id: string;
  competitionId: string;
  firstPlaceId?: string;
  secondPlaceId?: string;
  thirdPlaceId?: string;
  decidedAt: string;
  notes?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  section: string;
  phone: string;
  email?: string;
  rtRw?: string;
  idCardNumber: string; // e.g., PNT-001
  photoUrl?: string;
  joinedAt?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  participantId: string;
  competitionId: string;
  title: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Peserta';
  issueDate: string;
  verificationCode: string;
  qrCodeUrl?: string;
}

export interface Doorprize {
  id: string;
  name: string;
  sponsor?: string;
  categoryFilter: 'Semua' | Category;
  winnerParticipantId?: string;
  wonAt?: string;
}

export interface AppSettings {
  eventName: string;
  eventYear: number;
  theme: 'merah-putih' | 'dark' | 'light';
  logoUrl?: string;
  headOfCommittee: string;
  location: string;
  prefixRule: string;
  certificateTemplateText: string;
  autoBackup: boolean;
  colorTheme: string;
  lastBackupAt?: string;
  mcPhoneNumber?: string;
  language?: string;
}

export interface MoneyTransaction {
  id: string;
  date: string;
  type: 'Pemasukan' | 'Pengeluaran';
  category: string;
  description: string;
  amount: number;
  recordedBy?: string;
  createdAt: string;
}

export interface RabItem {
  id: string;
  section: string;
  itemName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalEstimated: number;
  realization: number;
  notes?: string;
}

export interface RundownItem {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  duration?: string;
  activity: string;
  participants?: string;
  pic: string;
  location: string;
  status: 'Belum Mulai' | 'Sedang Berlangsung' | 'Selesai';
  notes?: string;
}

export interface WaTemplate {
  id: string;
  title: string;
  category: 'panggilan' | 'pengingat' | 'selesai' | 'pengumuman' | 'lainnya';
  content: string;
  isDefault?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user?: string;
  ip?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
