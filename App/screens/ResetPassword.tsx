import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type ResetPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type Props = { navigation: ResetPasswordNavigationProp; route: any };

export default function ResetPassword({ navigation, route }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    const accessToken = route.params?.access_token; // récupéré depuis le lien Supabase

    const { error } = await supabase.auth.updateUser({ password: newPassword }, accessToken);
    if (error) Alert.alert('Erreur', error.message);
    else {
      Alert.alert('Succès', 'Mot de passe réinitialisé avec succès.');
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>

      <TextInput
        placeholder="Nouveau mot de passe"
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Confirmer le mot de passe"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
        <LinearGradient
          colors={['#5b36e8', '#af36e8']}
          start={{ x: 0.1, y: 0.8 }}
          end={{ x: 0.9, y: 0.2 }}
          style={styles.linearGradient}
        >
          <Text style={styles.gradientButtonText}>Réinitialiser</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, marginBottom: 35, textAlign: 'center', fontWeight: '700', color: '#333' },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  linearGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  gradientButtonText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
