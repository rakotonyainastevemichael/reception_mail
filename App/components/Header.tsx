// /components/Header.tsx
import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <SafeAreaView>
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0.1, y: 0.8 }}
        end={{ x: 0.9, y: 0.2 }}
        style={styles.linearGradient}
      >
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  linearGradient: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    // plus de bordures et ombre
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
