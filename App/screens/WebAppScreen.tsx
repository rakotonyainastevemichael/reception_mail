import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import FooterNav from '../components/FooterNav';
import { supabase } from '../lib/supabaseClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export default function WebAppScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fonction de déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login'); // Redirige vers login après déconnexion
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Header title="Gestion des règles" />

      {/* WebView */}
      <WebView
        source={{ uri: 'https://ruleweaver-flow.vercel.app/' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        injectedJavaScript={`
          const meta = document.createElement('meta');
          meta.setAttribute('name', 'viewport');
          meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
          document.head.appendChild(meta);
        `}
      />

      {/* Footer avec déconnexion */}
      <FooterNav active="web" onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
});
