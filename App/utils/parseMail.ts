export function parseMail(raw: any) {
  const text: string = raw.message || '';
  const lines: string[] = text.split('\n').map((line: string) => line.trim());

  const getLineValue = (prefix: string): string => {
    const line: string | undefined = lines.find((l: string) => l.startsWith(prefix));
    return line ? line.replace(prefix, '').trim() : '';
  };

  const sujet: string = getLineValue('🟢 SUJET :') || '(Sans sujet)';
  const senderRaw: string = getLineValue('EXPÉDITEUR :') || '';
  const destinataireRaw: string = getLineValue('DESTINATAIRE :') || '';
  const categorie: string = getLineValue('CATÉGORIE :') || '';
  const date: string = getLineValue('DATE :') || '';
  const resume: string = getLineValue('RÉSUMÉ :') || '';
  const link: string = lines.find((l: string) => l.startsWith('http')) || '';

  // Extraire nom et email de l'expéditeur
  let senderName: string = senderRaw;
  let senderEmail: string = 'Non précisé';
  const match = senderRaw.match(/<(.+)>/);
  if (match) {
    senderEmail = match[1];
    senderName = senderRaw.replace(`<${senderEmail}>`, '').trim() || senderEmail;
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
