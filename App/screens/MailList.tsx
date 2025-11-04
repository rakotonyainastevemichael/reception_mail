import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import { fetchMails, Mail } from '../services/mailService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import MailItem from '../components/MailItem';
import FooterNav from '../components/FooterNav';

type MailListProps = { navigation: NativeStackNavigationProp<RootStackParamList, 'MailList'> };

const socket = io('https://reception-message.onrender.com');

export default function MailList({ navigation }: MailListProps) {
  const [mails, setMails] = useState<Mail[]>([]);

  useEffect(() => {
    fetchMails()
      .then(setMails)
      .catch(err => console.error("❌ Erreur lors du fetch des mails :", err));
  }, []);

  useEffect(() => {
    socket.on('connect', () => console.log("✅ Connecté au serveur temps réel"));
    socket.on('new-mail', (mail: any) => setMails(prev => [mail, ...prev]));

    return () => {
      socket.off('new-mail');
      socket.off('connect');
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={mails}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('MailDetail', { mail: item })} activeOpacity={0.8}>
              <MailItem mail={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#555' }}>📭 Aucun mail reçu</Text>}
        />
      </View>
      <FooterNav active="mail" />
    </View>
  );
}
