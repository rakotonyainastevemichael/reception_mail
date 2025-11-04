import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mail } from '../services/mailService';

interface MailItemProps {
  mail: Mail;
}

const MailItem: React.FC<MailItemProps> = ({ mail }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.category}>{mail.emoji} {mail.categorie}</Text>
      <Text style={styles.subject}>Sujet : {mail.sujet}</Text>
      <Text style={styles.sender}>
        Expéditeur : {mail.senderName} ({mail.senderEmail || 'Non précisé'})
      </Text>
      <Text style={styles.date}>Date : {mail.date}</Text>
      <Text style={styles.summary}>Résumé : {mail.resume}</Text>
    </View>
  );
};

export default MailItem;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#d091d6ff',
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  category: { fontWeight: 'bold', color: '#444', fontSize: 16 },
  subject: { color: '#111', marginTop: 4, fontWeight: '600' },
  sender: { color: '#333', marginTop: 2 },
  date: { color: '#555', fontSize: 12, marginTop: 2 },
  summary: { color: '#222', marginTop: 5 },
});
