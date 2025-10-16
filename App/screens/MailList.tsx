// src/screens/MailList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import { fetchMails, Mail } from '../services/mailService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type MailListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MailList'>;
};

const socket = io('https://unexpended-unhabitable-darnell.ngrok-free.dev');

export default function MailList({ navigation }: MailListProps) {
  const [mails, setMails] = useState<Mail[]>([]);

  // Fetch initial
  useEffect(() => {
    fetchMails()
      .then(setMails)
      .catch(err => console.error("Erreur fetch:", err));
  }, []);

  // Temps réel
  useEffect(() => {
    socket.on('connect', () => {
      console.log("✅ Connecté au serveur temps réel");
    });

    socket.on('new-mail', (mail: Mail) => {
      console.log("📨 Nouveau mail reçu:", mail);
      setMails(prev => [mail, ...prev]);
    });

    return () => {
      socket.off('new-mail');
      socket.off('connect');
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f9f9f9' }}>
      <FlatList
        data={mails}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MailDetail', { mail: item })}
            style={{
              marginBottom: 10,
              padding: 15,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.subject}</Text>
            <Text numberOfLines={1} style={{ color: '#555' }}>{item.body}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>{item.from}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>📭 Aucun mail reçu</Text>
        }
      />
    </View>
  );
}
