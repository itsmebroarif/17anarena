export interface MessageOptions {
  phone: string;
  participantName: string;
  participantNumber: string;
  competitionName: string;
  location?: string;
  time?: string;
}

export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return '-';
  if (cleaned.startsWith('62')) {
    const rest = cleaned.substring(2);
    if (rest.length >= 8) {
      return `+62 ${rest.substring(0, 3)}-${rest.substring(3, 7)}-${rest.substring(7)}`;
    }
    return `+62 ${rest}`;
  }
  return '+' + cleaned;
}

export function generateWaitingLoungeCallMessage(opts: MessageOptions): string {
  const text = `Halo 👋

Panggilan Peserta Lomba Kemerdekaan 🇮🇩

*Peserta:* ${opts.participantName}
*Nomor Peserta:* ${opts.participantNumber}
*Lomba:* ${opts.competitionName}
${opts.location ? `*Lokasi:* ${opts.location}\n` : ''}${opts.time ? `*Jam:* ${opts.time}\n` : ''}
Silakan segera menuju area pertandingan / panggung.

Terima kasih.`;

  const phone = cleanPhoneNumber(opts.phone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateRegistrationConfirmationMessage(opts: MessageOptions): string {
  const text = `Halo ${opts.participantName}! 🎉

Pendaftaran Lomba Kemerdekaan Berhasil! 🇮🇩

*Nomor Peserta:* ${opts.participantNumber}
*Lomba:* ${opts.competitionName}
${opts.location ? `*Lokasi:* ${opts.location}\n` : ''}${opts.time ? `*Waktu:* ${opts.time}\n` : ''}
Harap hadir 15 menit sebelum lomba dimulai dan tunjukkan nomor peserta ini kepada panitia.

Semangat berlomba & Merdeka! ✊`;

  const phone = cleanPhoneNumber(opts.phone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function renderBulkTemplate(
  templateText: string,
  data: {
    participantName: string;
    participantNumber: string;
    competitionName: string;
    location?: string;
    status?: string;
    time?: string;
    category?: string;
  }
): string {
  let rendered = templateText;
  rendered = rendered.replace(/\{nama\}/gi, data.participantName || '');
  rendered = rendered.replace(/\{nomor\}/gi, data.participantNumber || '');
  rendered = rendered.replace(/\{lomba\}/gi, data.competitionName || '');
  rendered = rendered.replace(/\{lokasi\}/gi, data.location || '-');
  rendered = rendered.replace(/\{status\}/gi, data.status || '-');
  rendered = rendered.replace(/\{waktu\}/gi, data.time || '-');
  rendered = rendered.replace(/\{kategori\}/gi, data.category || '-');
  return rendered;
}

export function generateWaLink(phone: string, text: string): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  if (!cleanedPhone) return '#';
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
}

export function generateMcMessage(
  phone: string,
  templateType: 'custom' | 'ready_call' | 'winner' | 'rundown',
  data: {
    eventName?: string;
    customText?: string;
    competitionName?: string;
    participantName?: string;
    participantNumber?: string;
    winners?: { rank: string; name: string; number?: string }[];
  }
): string {
  let text = '';
  const event = data.eventName || 'Acara Kemerdekaan 🇮🇩';

  if (templateType === 'ready_call') {
    text = `🎤 *PANGGILAN UNTUK MC / PEMBAWA ACARA* 🇮🇩\n\n` +
      `Halo MC,\nMohon pemanggilan peserta lomba berikut untuk naik ke panggung / arena:\n\n` +
      `*Lomba:* ${data.competitionName || '-'}\n` +
      `*Nama Peserta:* ${data.participantName || '-'}\n` +
      `*No. Peserta:* ${data.participantNumber || '-'}\n\n` +
      `Peserta sudah siap di Waiting Lounge. Silakan dipanggil. Terima kasih! ✊`;
  } else if (templateType === 'winner') {
    let winnerText = '';
    if (data.winners && data.winners.length > 0) {
      winnerText = data.winners.map(w => `• ${w.rank}: *${w.name}* ${w.number ? `(${w.number})` : ''}`).join('\n');
    } else {
      winnerText = 'Pemenang resmi telah ditetapkan oleh dewan juri.';
    }
    text = `🏆 *PENGUMUMAN JUARA UNTUK MC* 🇮🇩\n\n` +
      `Halo MC, hasil pertandingan untuk *${data.competitionName || '-'}* telah final dan siap diumumkan:\n\n` +
      `${winnerText}\n\n` +
      `Mohon diumumkan saat penyerahan piala di Panggung Utama. Terima kasih! 🎉`;
  } else if (templateType === 'rundown') {
    text = `📋 *UPDATE SUSUNAN ACARA & PANITIA* 🇮🇩\n\n` +
      `Halo MC,\nBerikut update penting dari panitia untuk acara *${event}*:\n\n` +
      `${data.customText || 'Perlombaan siap dilanjutkan ke sesi berikutnya.'}\n\n` +
      `Merdeka! ✊`;
  } else {
    text = `📢 *INSTRUKSI PANITIA UNTUK MC* 🇮🇩\n\n` +
      `${data.customText || 'Pesan dari panitia arena.'}\n\n` +
      `-- Panitia Pelaksana ${event}`;
  }

  return generateWaLink(phone, text);
}

