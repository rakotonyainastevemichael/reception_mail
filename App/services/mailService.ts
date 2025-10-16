// src/services/mailService.ts
export interface Mail {
  from: string;
  subject: string;
  body: string;
  date: string;
}

export const fetchMails = async (): Promise<Mail[]> => {
  try {
    const response = await fetch('https://unexpended-unhabitable-darnell.ngrok-free.dev/mails');
    if (!response.ok) throw new Error('Erreur API mails');
    const mails: Mail[] = await response.json();
    return mails;
  } catch (error) {
    console.error('Erreur fetch mails:', error);
    return [];
  }
};
