import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { io } from 'socket.io-client';
import { fetchMails, Mail } from '../services/mailService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import MailItem from '../components/MailItem';
import FooterNav from '../components/FooterNav';
import Header from '../components/Header'; // <-- Import du header
import { supabase } from '../lib/supabaseClient';

type MailListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MailList'>;
};

const socket = io('https://reception-message.onrender.com');

export default function MailList({ navigation }: MailListProps) {
  const [mails, setMails] = useState<Mail[]>([]);

  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigation.replace('Login');
      }
    };
    checkAuth();
  }, [navigation]);

  // Récupération des mails
  useEffect(() => {
    fetchMails()
      .then(setMails)
      .catch(err => console.error("❌ Erreur lors du fetch des mails :", err));
  }, []);

  // Socket.IO pour mails en temps réel
  useEffect(() => {
    socket.on('connect', () => console.log("✅ Connecté au serveur temps réel"));
    socket.on('new-mail', (mail: any) => setMails(prev => [mail, ...prev]));

    return () => {
      socket.off('new-mail');
      socket.off('connect');
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Boîte de réception" />

      {/* Contenu */}
      <View style={styles.content}>
        <FlatList
          data={mails}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('MailDetail', { mail: item })}
              activeOpacity={0.8}
            >
              <MailItem mail={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>📭 Aucun mail reçu</Text>
          }
        />
      </View>

      {/* Footer */}
      <FooterNav active="mail" onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { flex: 1, padding: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#555', fontSize: 16 },
});
