export function parseMail(raw: any) {
  const text: string = raw.message || '';

  const lines = text.split('\n').map(l => l.trim());
  const get = (p: string) => {
    const line = lines.find(l => l.startsWith(p));
    return line ? line.replace(p, '').trim() : '';
  };

  const hasPrefixes = lines.some(l => l.startsWith('🟢 SUJET :'));

  let sujet = '';
  let senderRaw = '';
  let destinataireRaw = '';
  let categorie = raw.categorie || '';
  let date = raw.created_at || new Date().toISOString();
  let resume = '';
  let link = '';

  if (hasPrefixes) {
    sujet = get('🟢 SUJET :') || raw.sujet || '(Sans sujet)';
    senderRaw = get('EXPÉDITEUR :');
    destinataireRaw = get('DESTINATAIRE :');
    categorie = get('CATÉGORIE :') || categorie;
    date = get('DATE :') || date;
    resume = get('RÉSUMÉ :') || text;
    link = lines.find(l => l.startsWith('http')) || '';
  } else {
    sujet = raw.sujet || '(Sans sujet)';
    senderRaw =
      raw.from ||
      raw.sender ||
      raw.envelope?.from ||
      '';
    destinataireRaw =
      raw.to ||
      raw.envelope?.to ||
      '';
    resume = text.trim();
  }

  // ---- Extraction nom + email ----
  let senderName = '';
  let senderEmail = '';

  if (senderRaw) {
    const match = senderRaw.match(/(.+)?<(.+)>/);
    if (match) {
      senderName = match[1]?.trim() || match[2]?.trim();
      senderEmail = match[2]?.trim();
    } else {
      // Pas de <email>, on met le mail comme nom et email
      senderName = senderRaw;
      senderEmail = senderRaw;
    }
  }

  return {
    sujet,
    senderName,
    senderEmail,
    destinataire: destinataireRaw,
    categorie,
    date,
    resume,
    link,
    emoji: '🟢',
  };
}
