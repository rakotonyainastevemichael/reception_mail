import { AssistantMessage } from '../types';
import { supabase } from '../lib/supabaseClient';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'https://reception-message.onrender.com';

interface UserData {
  id: string;
  full_name?: string;
  fullname?: string;
  name?: string;
}

export async function sendAssistantMessage(userId: string, message: string) {
  // Supabase v2 : ne pas typer sur from<>
  const { data: userData, error } = await supabase
    .from('users')
    .select('id, full_name, fullname, name')
    .eq('id', userId)
    .single<UserData>(); // <-- typer ici

  if (error) console.error('Erreur récupération user:', error);

  const fullName = userData?.full_name || userData?.fullname || userData?.name || '';

  const payload = { userId, userName: fullName, message };

  const res = await fetch(`${SERVER_URL}/assistant/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Assistant API error: ${res.status} - ${text}`);
  }

  return res.json();
}

export async function getAssistantHistory(userId: string, limit = 50) {
  const res = await fetch(`${SERVER_URL}/assistant/history?userId=${encodeURIComponent(userId)}&limit=${limit}`);
  if (!res.ok) throw new Error('Impossible de récupérer l\'historique assistant');
  return res.json();
}
