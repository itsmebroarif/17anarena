import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

export type LanguageCode = 'id' | 'en' | 'ja' | 'ko' | 'zh' | 'ar' | 'de' | 'nl';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  id: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.registration': 'Pendaftaran Peserta',
    'nav.competitions': 'Cabang Perlombaan',
    'nav.liveArena': 'Panggung Live Arena',
    'nav.scoring': 'Input Skor & Juri',
    'nav.doorprize': 'Undian Doorprize',
    'nav.certificates': 'E-Sertifikat',
    'nav.committee': 'Susunan Panitia',
    'nav.tutorial': 'Tutorial & Panduan',
    'nav.settings': 'Pengaturan Sistem',

    // Header & Actions
    'header.searchPlaceholder': 'Cari nama peserta, ID, atau lomba...',
    'header.broadcastWa': 'Broadcast WA',
    'header.shortcuts': 'Pintasan Keyboard',
    'header.online': 'Online (Sistem Siap)',
    'header.offline': 'Offline (Lokal HP/PC)',

    // Common
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.edit': 'Edit',
    'common.delete': 'Hapus',
    'common.search': 'Cari',
    'common.print': 'Cetak',
    'common.export': 'Ekspor',
    'common.import': 'Impor',
    'common.close': 'Tutup',
    'common.success': 'Berhasil',
    'common.error': 'Terjadi Kesalahan',
    'common.status': 'Status',
    'common.actions': 'Aksi',
    'common.total': 'Total',
    'common.details': 'Detail',

    // Dashboard
    'dashboard.title': 'Dashboard Arena 17-an',
    'dashboard.subtitle': 'Pusat Kendali Sistem Pendaftaran & Manajemen Perlombaan Kemerdekaan RI',
    'dashboard.totalParticipants': 'Total Peserta',
    'dashboard.totalCompetitions': 'Cabang Lomba',
    'dashboard.totalRegistrations': 'Total Pendaftaran',
    'dashboard.totalWinners': 'Juara Terpilih',

    // Settings
    'settings.title': 'Pengaturan Sistem & Acara',
    'settings.eventName': 'Nama Acara / Event',
    'settings.eventYear': 'Tahun Acara',
    'settings.headOfCommittee': 'Ketua Panitia Pelaksana',
    'settings.location': 'Lokasi Pelaksanaan',
    'settings.mcPhoneNumber': 'Nomor WA MC / Pembawa Acara',
    'settings.languageSelect': 'Pilih Bahasa Tampilan',
    'settings.darkMode': 'Mode Tampilan Dark Mode (Tema Gelap)',
    'settings.saveSuccess': 'Pengaturan berhasil disimpan!'
  },

  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.registration': 'Participant Registration',
    'nav.competitions': 'Competition Branches',
    'nav.liveArena': 'Live Arena Stage',
    'nav.scoring': 'Scoring & Jury',
    'nav.doorprize': 'Door Prize Raffle',
    'nav.certificates': 'E-Certificates',
    'nav.committee': 'Committee Structure',
    'nav.tutorial': 'Tutorial & Guide',
    'nav.settings': 'System Settings',

    // Header & Actions
    'header.searchPlaceholder': 'Search participant, ID, or competition...',
    'header.broadcastWa': 'WA Broadcast',
    'header.shortcuts': 'Keyboard Shortcuts',
    'header.online': 'Online (System Ready)',
    'header.offline': 'Offline (Local PC/Mobile)',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.print': 'Print',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.close': 'Close',
    'common.success': 'Success',
    'common.error': 'An Error Occurred',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.total': 'Total',
    'common.details': 'Details',

    // Dashboard
    'dashboard.title': '17th Arena Dashboard',
    'dashboard.subtitle': 'Command Center for Independence Day Competition Management & Registration',
    'dashboard.totalParticipants': 'Total Participants',
    'dashboard.totalCompetitions': 'Competitions',
    'dashboard.totalRegistrations': 'Total Registrations',
    'dashboard.totalWinners': 'Winners Selected',

    // Settings
    'settings.title': 'System & Event Settings',
    'settings.eventName': 'Event Name',
    'settings.eventYear': 'Event Year',
    'settings.headOfCommittee': 'Head of Committee',
    'settings.location': 'Event Location',
    'settings.mcPhoneNumber': 'MC WhatsApp Number',
    'settings.languageSelect': 'Select Display Language',
    'settings.darkMode': 'Dark Mode Theme',
    'settings.saveSuccess': 'Settings saved successfully!'
  },

  ja: {
    'nav.dashboard': 'ダッシュボード',
    'nav.registration': '参加者登録',
    'nav.competitions': '競技種目',
    'nav.liveArena': 'ライブアリーナ',
    'nav.scoring': '採点と審査員',
    'nav.doorprize': 'ドアプライズ抽選',
    'nav.certificates': '電子賞状',
    'nav.committee': '実行委員会',
    'nav.tutorial': 'チュートリアル',
    'nav.settings': 'システム設定',

    'header.searchPlaceholder': '参加者名、ID、競技を検索...',
    'header.broadcastWa': 'WA一斉送信',
    'header.shortcuts': 'ショートカット',
    'header.online': 'オンライン (準備完了)',
    'header.offline': 'オフライン (ローカル)',

    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.search': '検索',
    'common.print': '印刷',
    'common.export': 'エクスポート',
    'common.import': 'インポート',
    'common.close': '閉じる',
    'common.success': '成功',
    'common.error': 'エラーが発生しました',
    'common.status': 'ステータス',
    'common.actions': '操作',
    'common.total': '合計',
    'common.details': '詳細',

    'dashboard.title': '17アリーナ ダッシュボード',
    'dashboard.subtitle': '独立記念日競技大会登録・運営管理コマンドセンター',
    'dashboard.totalParticipants': '総参加者数',
    'dashboard.totalCompetitions': '競技数',
    'dashboard.totalRegistrations': '総登録数',
    'dashboard.totalWinners': '決定した入賞者',

    'settings.title': 'システムおよびイベント設定',
    'settings.eventName': 'イベント名',
    'settings.eventYear': '開催年',
    'settings.headOfCommittee': '実行委員長',
    'settings.location': '開催場所',
    'settings.mcPhoneNumber': '司会者 WhatsApp番号',
    'settings.languageSelect': '表示言語の選択',
    'settings.darkMode': 'ダークモード設定',
    'settings.saveSuccess': '設定を保存しました！'
  },

  ko: {
    'nav.dashboard': '대시보드',
    'nav.registration': '참가자 등록',
    'nav.competitions': '경기 종목',
    'nav.liveArena': '라이브 아레나 스테이지',
    'nav.scoring': '점수 입력 및 심사',
    'nav.doorprize': '경품 추첨',
    'nav.certificates': '전자 상장',
    'nav.committee': '조직위원회',
    'nav.tutorial': '튜토리얼 및 가이드',
    'nav.settings': '시스템 설정',

    'header.searchPlaceholder': '참가자 이름, ID 또는 경기 검색...',
    'header.broadcastWa': 'WA 브로드캐스트',
    'header.shortcuts': '단축키',
    'header.online': '온라인 (시스템 준비완료)',
    'header.offline': '오프라인 (로컬)',

    'common.save': '저장',
    'common.cancel': '취소',
    'common.edit': '수정',
    'common.delete': '삭제',
    'common.search': '검색',
    'common.print': '인쇄',
    'common.export': '내보내기',
    'common.import': '가져오기',
    'common.close': '닫기',
    'common.success': '성공',
    'common.error': '오류가 발생했습니다',
    'common.status': '상태',
    'common.actions': '작업',
    'common.total': '합계',
    'common.details': '상세 정보',

    'dashboard.title': '17 아레나 대시보드',
    'dashboard.subtitle': '독립기념일 경기 관리 및 등록 운영 센터',
    'dashboard.totalParticipants': '총 참가자',
    'dashboard.totalCompetitions': '경기 종목',
    'dashboard.totalRegistrations': '총 등록',
    'dashboard.totalWinners': '선정된 수상자',

    'settings.title': '시스템 및 이벤트 설정',
    'settings.eventName': '이벤트 이름',
    'settings.eventYear': '이벤트 연도',
    'settings.headOfCommittee': '위원장 이름',
    'settings.location': '행사 장소',
    'settings.mcPhoneNumber': '사회자 WhatsApp 번호',
    'settings.languageSelect': '표시 언어 선택',
    'settings.darkMode': '다크 모드',
    'settings.saveSuccess': '설정이 성공적으로 저장되었습니다!'
  },

  zh: {
    'nav.dashboard': '控制面板',
    'nav.registration': '参赛者报名',
    'nav.competitions': '比赛项目',
    'nav.liveArena': '现场竞技舞台',
    'nav.scoring': '打分与裁判',
    'nav.doorprize': '幸运抽奖',
    'nav.certificates': '电子证书',
    'nav.committee': '组委会结构',
    'nav.tutorial': '教程与指南',
    'nav.settings': '系统设置',

    'header.searchPlaceholder': '搜索参赛者姓名、ID或比赛...',
    'header.broadcastWa': 'WA 广播',
    'header.shortcuts': '快捷键',
    'header.online': '在线 (系统就绪)',
    'header.offline': '离线 (本地模式)',

    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.search': '搜索',
    'common.print': '打印',
    'common.export': '导出',
    'common.import': '导入',
    'common.close': '关闭',
    'common.success': '成功',
    'common.error': '发生错误',
    'common.status': '状态',
    'common.actions': '操作',
    'common.total': '总计',
    'common.details': '详情',

    'dashboard.title': '17竞技场 控制面板',
    'dashboard.subtitle': '独立日比赛管理与报名指挥中心',
    'dashboard.totalParticipants': '总参赛人数',
    'dashboard.totalCompetitions': '比赛项目',
    'dashboard.totalRegistrations': '总报名人次',
    'dashboard.totalWinners': '已选出获奖者',

    'settings.title': '系统与活动设置',
    'settings.eventName': '活动名称',
    'settings.eventYear': '活动年份',
    'settings.headOfCommittee': '组委会主席',
    'settings.location': '活动地点',
    'settings.mcPhoneNumber': '主持人 WhatsApp 号码',
    'settings.languageSelect': '选择显示语言',
    'settings.darkMode': '深色模式',
    'settings.saveSuccess': '设置保存成功！'
  },

  ar: {
    'nav.dashboard': 'لوحة التحكم',
    'nav.registration': 'تسجيل المشاركين',
    'nav.competitions': 'فروع المسابقة',
    'nav.liveArena': 'المسرح الحي',
    'nav.scoring': 'النتائج والتحكيم',
    'nav.doorprize': 'سحب الجوائز',
    'nav.certificates': 'الشهادات الإلكترونية',
    'nav.committee': 'هيكل اللجنة',
    'nav.tutorial': 'الدليل والتعليمات',
    'nav.settings': 'إعدادات النظام',

    'header.searchPlaceholder': 'البحث عن مشارك أو معرف أو مسابقة...',
    'header.broadcastWa': 'بث واتساب',
    'header.shortcuts': 'اختصارات لوحة المفاتيح',
    'header.online': 'متصل (النظام جاهز)',
    'header.offline': 'غير متصل (محلي)',

    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.search': 'بحث',
    'common.print': 'طباعة',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.close': 'إغلاق',
    'common.success': 'نجاح',
    'common.error': 'حدث خطأ',
    'common.status': 'الحالة',
    'common.actions': 'الإجراءات',
    'common.total': 'الإجمالي',
    'common.details': 'التفاصيل',

    'dashboard.title': 'لوحة تحكم الساحة 17',
    'dashboard.subtitle': 'مركز قيادة إدارة وتصميم مسابقات يوم الاستقلال',
    'dashboard.totalParticipants': 'إجمالي المشاركين',
    'dashboard.totalCompetitions': 'فروع المسابقة',
    'dashboard.totalRegistrations': 'إجمالي التسجيلات',
    'dashboard.totalWinners': 'الفائزون المختارون',

    'settings.title': 'إعدادات النظام والحدث',
    'settings.eventName': 'اسم الحدث',
    'settings.eventYear': 'سنة الحدث',
    'settings.headOfCommittee': 'رئيس اللجنة',
    'settings.location': 'موقع الحدث',
    'settings.mcPhoneNumber': 'رقم واتساب للمذيع',
    'settings.languageSelect': 'اختر لغة العرض',
    'settings.darkMode': 'الوضع الداكن',
    'settings.saveSuccess': 'تم حفظ الإعدادات بنجاح!'
  },

  de: {
    'nav.dashboard': 'Dashboard',
    'nav.registration': 'Teilnehmerregistrierung',
    'nav.competitions': 'Wettbewerbssparten',
    'nav.liveArena': 'Live-Arena-Bühne',
    'nav.scoring': 'Bewertung & Jury',
    'nav.doorprize': 'Tombola & Gewinne',
    'nav.certificates': 'E-Zertifikate',
    'nav.committee': 'Komitee-Struktur',
    'nav.tutorial': 'Anleitung & Leitfaden',
    'nav.settings': 'Systemeinstellungen',

    'header.searchPlaceholder': 'Teilnehmer, ID oder Wettbewerb suchen...',
    'header.broadcastWa': 'WA-Rundmail',
    'header.shortcuts': 'Tastenkürzel',
    'header.online': 'Online (Bereit)',
    'header.offline': 'Offline (Lokal)',

    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.search': 'Suchen',
    'common.print': 'Drucken',
    'common.export': 'Exportieren',
    'common.import': 'Importieren',
    'common.close': 'Schließen',
    'common.success': 'Erfolgreich',
    'common.error': 'Fehler aufgetreten',
    'common.status': 'Status',
    'common.actions': 'Aktionen',
    'common.total': 'Gesamt',
    'common.details': 'Details',

    'dashboard.title': '17er Arena Dashboard',
    'dashboard.subtitle': 'Kommandozentrale für Wettbewerbsverwaltung & Registrierung zum Unabhängigkeitstag',
    'dashboard.totalParticipants': 'Gesamte Teilnehmer',
    'dashboard.totalCompetitions': 'Wettbewerbe',
    'dashboard.totalRegistrations': 'Gesamte Anmeldungen',
    'dashboard.totalWinners': 'Ermittelte Sieger',

    'settings.title': 'System- & Eventeinstellungen',
    'settings.eventName': 'Veranstaltungsname',
    'settings.eventYear': 'Veranstaltungsjahr',
    'settings.headOfCommittee': 'Komiteevorsitzender',
    'settings.location': 'Veranstaltungsort',
    'settings.mcPhoneNumber': 'Moderator WhatsApp-Nummer',
    'settings.languageSelect': 'Anzeigesprache wählen',
    'settings.darkMode': 'Dunkelmodus',
    'settings.saveSuccess': 'Einstellungen erfolgreich gespeichert!'
  },

  nl: {
    'nav.dashboard': 'Dashboard',
    'nav.registration': 'Deelnemersregistratie',
    'nav.competitions': 'Wedstrijdsonderdelen',
    'nav.liveArena': 'Live Arena Podium',
    'nav.scoring': 'Scoring & Jury',
    'nav.doorprize': 'Loterij & Prijzen',
    'nav.certificates': 'E-Certificaten',
    'nav.committee': 'Comité Structuur',
    'nav.tutorial': 'Handleiding & Gids',
    'nav.settings': 'Systeeminstellingen',

    'header.searchPlaceholder': 'Zoek deelnemer, ID of wedstrijd...',
    'header.broadcastWa': 'WA Uitzending',
    'header.shortcuts': 'Sneltoetsen',
    'header.online': 'Online (Systeem gereed)',
    'header.offline': 'Offline (Lokaal)',

    'common.save': 'Opslaan',
    'common.cancel': 'Annuleren',
    'common.edit': 'Bewerken',
    'common.delete': 'Verwijderen',
    'common.search': 'Zoeken',
    'common.print': 'Afdrukken',
    'common.export': 'Exporteren',
    'common.import': 'Importeren',
    'common.close': 'Sluiten',
    'common.success': 'Succes',
    'common.error': 'Fout opgetreden',
    'common.status': 'Status',
    'common.actions': 'Acties',
    'common.total': 'Totaal',
    'common.details': 'Details',

    'dashboard.title': '17an Arena Dashboard',
    'dashboard.subtitle': 'Besturingscentrum voor Onafhankelijkheidsdag Wedstrijdbeheer',
    'dashboard.totalParticipants': 'Totaal Deelnemers',
    'dashboard.totalCompetitions': 'Wedstrijden',
    'dashboard.totalRegistrations': 'Totaal Inschrijvingen',
    'dashboard.totalWinners': 'Geselecteerde Winnaars',

    'settings.title': 'Systeem & Evenement Instellingen',
    'settings.eventName': 'Evenement Naam',
    'settings.eventYear': 'Evenement Jaar',
    'settings.headOfCommittee': 'Comité Voorzitter',
    'settings.location': 'Locatie',
    'settings.mcPhoneNumber': 'Presenter WhatsApp Nummer',
    'settings.languageSelect': 'Kies Weergavetaal',
    'settings.darkMode': 'Donkere Modus',
    'settings.saveSuccess': 'Instellingen succesvol opgeslagen!'
  }
};

export function t(key: string, defaultText?: string): string {
  const store = useArenaStore();
  const lang = (store.settings.language as LanguageCode) || 'id';

  // Apply RTL direction for Arabic
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  const dict = TRANSLATIONS[lang] || TRANSLATIONS['id'];
  return dict[key] || TRANSLATIONS['id'][key] || defaultText || key;
}

export const activeLanguage = computed(() => {
  const store = useArenaStore();
  return store.settings.language || 'id';
});
