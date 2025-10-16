// src/screens/MailDetail.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type MailDetailRouteProp = RouteProp<RootStackParamList, 'MailDetail'>;

type Props = {
  route: MailDetailRouteProp;
};

export default function MailDetail({ route }: Props) {
  const { mail } = route.params;

  if (!mail) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>
          ❌ Aucun mail sélectionné
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
        {mail.subject}
      </Text>
      <Text style={{ marginBottom: 5, color: '#333' }}>From: {mail.from}</Text>
      <Text style={{ marginBottom: 5, color: '#333' }}>Date: {mail.date}</Text>
      <View style={{ marginTop: 20 }}>
        <Text style={{ lineHeight: 20 }}>{mail.body}</Text>
      </View>
    </ScrollView>
  );
}
