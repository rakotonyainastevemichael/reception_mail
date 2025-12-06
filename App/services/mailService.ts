import { parseMail } from '../utils/parseMail';

export interface Mail {
  emoji: string;
  label: string;
  sujet: string;
  senderName: string;
  senderEmail?: string;
  date: string;
  message: string;
  destinataire?: string;
  categorie?: string;
  link?: string;
  resume?: string;
}

export const fetchMails = async (): Promise<Mail[]> => {
  try {
    const response = await fetch('https://reception-message.onrender.com/mails');
    if (!response.ok) throw new Error('Erreur API mails');
    const data = await response.json();

    const mails: Mail[] = data.map((m: any) => {
      console.log("RAW MAIL FROM API:", m); 
      const parsed = parseMail(m); // <-- utilise parseMail pour chaque message
      return {
        emoji: parsed.emoji || '📩',
        label: parsed.categorie || 'Message',
        sujet: parsed.sujet,
        senderName: parsed.senderName,
        senderEmail: parsed.senderEmail,
        date: parsed.date,
        message: parsed.resume || '', // résumé pour l'affichage en liste
        destinataire: parsed.destinataire,
        categorie: parsed.categorie,
        link: parsed.link,
        resume: parsed.resume,
      };
    });

    return mails;
  } catch (error) {
    console.error('Erreur fetch mails:', error);
    return [];
  }
};
