// src/types.ts
import { Mail } from './services/mailService';

export type RootStackParamList = {
  MailList: undefined;
  MailDetail: { mail: Mail };
};
