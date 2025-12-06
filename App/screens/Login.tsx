import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type Props = { navigation: LoginScreenNavigationProp };

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Erreur', error.message);
    else navigation.replace('MailList');
  };
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email pour réinitialiser le mot de passe.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'yourapp://reset-password', // adapter selon ton deep link
    });

    if (error) Alert.alert('Erreur', error.message);
    else Alert.alert('Succès', 'Un email de réinitialisation a été envoyé.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
        <LinearGradient
          colors={['#5b36e8', '#af36e8']}
          start={{ x: 0.1, y: 0.8 }}
          end={{ x: 0.9, y: 0.2 }}
          style={styles.linearGradient}
        >
          <Text style={styles.gradientButtonText}>Se connecter</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.forgotPassword} onPress={handleForgotPassword}>
        Mot de passe oublié ?
      </Text>

      <Text style={styles.signup} onPress={() => navigation.navigate('Signup')}>
        Pas de compte ? Inscrivez-vous
      </Text>
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
  forgotPassword: { marginTop: 15, textAlign: 'center', fontSize: 15, color: '#d40000', fontWeight: '500' },
  signup: { marginTop: 25, textAlign: 'center', fontSize: 15, color: '#5b36e8', fontWeight: '500' },
});
