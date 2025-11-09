// src/types.ts
import { Mail } from './services/mailService';

export type RootStackParamList = {
  MailList: undefined;
  MailDetail: { mail: Mail };
  Login: undefined;
  Signup: undefined;
  WebApp: undefined;
};
// /home/steve/stage/N8n_mail/App/types.ts
export type Contact = {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  metadata?: any;
  created_at?: string;
};

export type PlanningItem = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_at: string; // ISO
  end_at?: string;  // ISO
  type?: 'meeting' | 'call' | 'task' | string;
  location?: string;
};

export type AssistantMessage = {
  id?: string;
  user_id?: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  created_at?: string;
};
