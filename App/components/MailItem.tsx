// components/MailItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mail } from '../services/mailService';

interface MailItemProps {
  mail: Mail;
}

const MailItem: React.FC<MailItemProps> = ({ mail }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.from}>{mail.from}</Text>
      <Text style={styles.subject}>{mail.subject}</Text>
      <Text style={styles.body}>{mail.body}</Text>
      <Text style={styles.date}>{new Date(mail.date).toLocaleString()}</Text>
    </View>
  );
};

export default MailItem;

const styles = StyleSheet.create({
  container: { padding: 10, borderBottomWidth: 1, borderColor: '#444' },
  from: { fontWeight: 'bold', color: '#fff' },
  subject: { fontSize: 16, color: '#fff', marginTop: 2 },
  body: { marginTop: 5, color: '#ccc' },
  date: { fontSize: 12, color: '#999', marginTop: 5 },
});
