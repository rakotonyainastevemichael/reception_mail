// components/FooterNav.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = { active: 'mail' | 'web' };

export default function FooterNav({ active }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('MailList')}>
        <Text style={[styles.icon, active === 'mail' && styles.active]}>📧</Text>
        
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('WebApp')}>
        <Text style={[styles.icon, active === 'web' && styles.active]}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#563a8aff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',

  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  active: {
    opacity: 1,
    color: '#007AFF',
  },
});
