  import React from 'react';
  import { ScrollView, Text, View, Linking, StyleSheet, TouchableOpacity } from 'react-native';
  import { RouteProp } from '@react-navigation/native';
  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { RootStackParamList } from '../navigation/AppNavigator';
  import Header from '../components/Header';
  import FooterNav from '../components/FooterNav';
  import { supabase } from '../lib/supabaseClient';
  import { LinearGradient } from 'expo-linear-gradient';

  const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

  type MailDetailRouteProp = RouteProp<RootStackParamList, 'MailDetail'>;
  type Props = { 
    route: MailDetailRouteProp;
    navigation: NativeStackNavigationProp<RootStackParamList, 'MailDetail'>;
  };

  export default function MailDetail({ route, navigation }: Props) {
    const { mail }: { mail?: any } = route.params || {};

    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigation.replace('Login');
    };

    if (!mail || Object.keys(mail).length === 0) {
      return (
        <View style={styles.container}>
          <Header title="Mail" />
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>❌ Aucun mail sélectionné</Text>
          </View>
          <FooterNav active="mail" onLogout={handleLogout} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* HEADER */}
        <Header title="Mail" />

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0.1, y: 0.8 }}
            end={{ x: 0.9, y: 0.2 }}
            style={styles.mailBox as any} // ignore l'erreur TS
          >
            <Text style={styles.subject}>{mail.sujet}</Text>
            <Text style={styles.info}>📧 De : {mail.senderName} ({mail.senderEmail || 'Non précisé'})</Text>
            <Text style={styles.info}>🕓 Date : {mail.date}</Text>

            <View style={styles.contentBox}>
              <Text style={styles.content}>{mail.resume}</Text>
              {mail.link && (
                <Text 
                  style={styles.link} 
                  onPress={() => Linking.openURL(mail.link)}
                >
                  📎 Ouvrir l’email
                </Text>
              )}
            </View>
          </LinearGradient>
        </ScrollView>

        {/* FOOTER */}
        <FooterNav active="mail" onLogout={handleLogout} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f7' },

    emptyBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: 'red',
      fontWeight: 'bold',
    },

    mailBox: {
      borderRadius: 18,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: -2, height: -2 },
    },

    subject: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 12,
    },

    info: {
      fontSize: 14,
      color: '#eee',
      marginBottom: 4,
    },

    contentBox: {
      padding: 12,
      borderRadius: 14,
      marginTop: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 2, height: 2 },
    },

    content: {
      fontSize: 15,
      color: '#fff',
      lineHeight: 22,
    },

    link: {
      marginTop: 10,
      color: '#5b36e8',
      fontWeight: 'bold',
    },

    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });
