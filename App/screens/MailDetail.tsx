import React from 'react';
import { ScrollView, Text, View, Linking } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import FooterNav from '../components/FooterNav';

type MailDetailRouteProp = RouteProp<RootStackParamList, 'MailDetail'>;

type Props = { route: MailDetailRouteProp };

export default function MailDetail({ route }: Props) {
  const { mail }: { mail?: any } = route.params || {};

  if (!mail || Object.keys(mail).length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>❌ Aucun mail sélectionné</Text>
        <FooterNav active="mail" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10, color: '#000' }}>
          {mail.sujet}
        </Text>

        <Text style={{ marginBottom: 5, color: '#333' }}>
          📧 De : {mail.senderName} ({mail.senderEmail || 'Non précisé'})
        </Text>

        <Text style={{ marginBottom: 5, color: '#333' }}>🕓 Date : {mail.date}</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={{ lineHeight: 22, color: '#000' }}>{mail.resume}</Text>
          {mail.link && (
            <Text style={{ marginTop: 10, color: '#1a73e8' }} onPress={() => Linking.openURL(mail.link)}>
              📎 Ouvrir l’email
            </Text>
          )}
        </View>
      </ScrollView>

      <FooterNav active="mail" />
    </View>
  );
}
