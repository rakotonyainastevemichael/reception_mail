// /components/MainLayout.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import FooterNav from './FooterNav';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  children: React.ReactNode;
  active: 'assistant' | 'mail' | 'planning' | 'contacts' | 'web' | 'rules';
};

export default function MainLayout({ children, active }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fonction pour se déconnecter
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter : ' + error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Assure-toi d'avoir un écran Login dans ton Navigator
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <FooterNav active={active} onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { flex: 1 }, // prend tout l'espace sauf le footer
});
