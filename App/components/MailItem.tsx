import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail } from '../services/mailService';

interface MailItemProps {
  mail: Mail;
}

// Dégradé violet → rose
const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

const MailItem: React.FC<MailItemProps> = ({ mail }) => {
  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0.1, y: 0.8 }}
      end={{ x: 0.9, y: 0.2 }}
      style={styles.container as any} // ignore l'erreur TS
    >
      <Text style={styles.category}>{mail.emoji} {mail.categorie}</Text>
      <Text style={styles.subject}>Sujet : {mail.sujet}</Text>
      <Text style={styles.sender}>
        Expéditeur : {mail.senderName} ({mail.senderEmail || 'Non précisé'})
      </Text>
      <Text style={styles.date}>Date : {mail.date}</Text>
      <Text style={styles.summary}>Résumé : {mail.resume}</Text>
    </LinearGradient>
  );
};

export default MailItem;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  category: { fontWeight: 'bold', color: '#fff', fontSize: 16 },
  subject: { color: '#fff', marginTop: 4, fontWeight: '600' },
  sender: { color: '#fff', marginTop: 2 },
  date: { color: '#eee', fontSize: 12, marginTop: 2 },
  summary: { color: '#fff', marginTop: 5 },
});
