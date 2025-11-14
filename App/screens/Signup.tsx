import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;
type Props = { navigation: SignupScreenNavigationProp };

export default function Signup({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont requis.');
      return;
    }

    // Inscription Supabase
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }

    // Ajouter nom et prénom dans la table users
    if (data.user) {
      const { error: updateError } = await supabase
        .from('profiles') // supposons que tu as une table 'profiles'
        .insert([{ id: data.user.id, first_name: firstName, last_name: lastName }]);

      if (updateError) {
        Alert.alert('Erreur', updateError.message);
        return;
      }
    }

    Alert.alert('Succès', 'Compte créé ! Connectez-vous.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      {/* Prénom */}
      <TextInput
        placeholder="Prénom"
        placeholderTextColor="#999"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Nom */}
      <TextInput
        placeholder="Nom"
        placeholderTextColor="#999"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Mot de passe */}
      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Bouton S’inscrire */}
      <TouchableOpacity onPress={handleSignup} activeOpacity={0.9}>
        <LinearGradient
          colors={['#5b36e8', '#af36e8']}
          start={{ x: 0.1, y: 0.8 }}
          end={{ x: 0.9, y: 0.2 }}
          style={styles.linearGradient}
        >
          <Text style={styles.buttonText}>S’inscrire</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Bouton Retour Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.backLoginBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.backLoginText}>← Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  linearGradient: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  backLoginBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  backLoginText: {
    color: '#5b36e8',
    fontWeight: '600',
    fontSize: 15,
  },
});
