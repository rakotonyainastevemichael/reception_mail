// /home/steve/stage/N8n_mail/App/components/FooterNav.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = { 
  active: 'assistant' | 'mail' | 'planning' | 'contacts' | 'web' | 'rules';
  onLogout?: () => void;
};

export default function FooterNav({ active, onLogout }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogoutPress = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', style: 'destructive', onPress: () => onLogout && onLogout() },
      ]
    );
  };

  return (
    <View style={styles.footer}>
      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Assistant')}>
          <Text style={[styles.icon, active === 'assistant' && styles.active]}>🧠</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MailList')}>
          <Text style={[styles.icon, active === 'mail' && styles.active]}>📧</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Planning')}>
          <Text style={[styles.icon, active === 'planning' && styles.active]}>🗓️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contacts')}>
          <Text style={[styles.icon, active === 'contacts' && styles.active]}>👥</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('WebApp')}>
          <Text style={[styles.icon, active === 'web' && styles.active]}>⚙️</Text>
        </TouchableOpacity>

       
      </View>

      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Text style={styles.logoutText}>🔒</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#563a8aff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#ffffff20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
  },
  icon: {
    fontSize: 22,
    color: '#fff',
    opacity: 0.8,
  },
  active: {
    opacity: 1,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
