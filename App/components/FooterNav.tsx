// /components/FooterNav.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

// Expo vector icons
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

type Props = { 
  active: 'assistant' | 'mail' | 'planning' | 'contacts' | 'web' | 'rules';
  onLogout?: () => void;
};

export default function FooterNav({ active, onLogout }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogoutPress = () => {
    if (onLogout) onLogout();
  };

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.footer}
    >
      <View style={styles.iconRow}>
        <FooterButton
          icon={<FontAwesome5 name="robot" size={28} color={active === 'assistant' ? '#fff' : '#ccc'} />}
          active={active === 'assistant'}
          onPress={() => navigation.navigate('Assistant')}
        />
        <FooterButton
          icon={<MaterialIcons name="email" size={28} color={active === 'mail' ? '#fff' : '#ccc'} />}
          active={active === 'mail'}
          onPress={() => navigation.navigate('MailList')}
        />
        <FooterButton
          icon={<FontAwesome5 name="calendar-alt" size={28} color={active === 'planning' ? '#fff' : '#ccc'} />}
          active={active === 'planning'}
          onPress={() => navigation.navigate('Planning')}
        />
        <FooterButton
          icon={<Entypo name="users" size={28} color={active === 'contacts' ? '#fff' : '#ccc'} />}
          active={active === 'contacts'}
          onPress={() => navigation.navigate('Contacts')}
        />
        <FooterButton
          icon={<Ionicons name="settings" size={28} color={active === 'web' ? '#fff' : '#ccc'} />}
          active={active === 'web'}
          onPress={() => navigation.navigate('WebApp')}
        />
        {onLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const FooterButton = ({ icon, active, onPress }: { icon: React.ReactNode; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.button,
      active && styles.activeButton,
      active && { shadowColor: '#fff', shadowOpacity: 0.8, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }
    ]}
  >
    {icon}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center', // toutes les icônes centrées
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 12,
    marginHorizontal: 8, // espace entre les icônes
    borderRadius: 16,
    backgroundColor: '#ffffff20',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  activeButton: {
    backgroundColor: '#ffffff50',
  },
  logoutButton: {
    padding: 12,
    marginLeft: 12, // espace après la dernière icône
    borderRadius: 16,
    backgroundColor: '#ffffff30',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
