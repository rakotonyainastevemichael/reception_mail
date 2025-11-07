import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = { 
  active: 'mail' | 'web';
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
      {/* Groupe Mail/Web à gauche */}
      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MailList')}>
          <Text style={[styles.icon, active === 'mail' && styles.active]}>📧</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('WebApp')}>
          <Text style={[styles.icon, active === 'web' && styles.active]}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Déconnexion à droite */}
      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Text style={styles.logoutText}>🔒 Déconnexion</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#563a8aff',
    flexDirection: 'row',
    justifyContent: 'space-between', // Mail/Web à gauche, logout à droite
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffffff20', // léger fond pour les boutons
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  icon: {
    fontSize: 24,
    opacity: 0.8,
    color: '#fff',
  },
  active: {
    opacity: 1,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
