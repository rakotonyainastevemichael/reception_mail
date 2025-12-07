import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import FooterNav from '../components/FooterNav';

const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

export default function Assistant({ navigation }: any) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error.message);
      setSession(data.session);
      setLoading(false);
    };
    loadSession();
  }, []);

  if (loading) return <Text style={{ color: '#333', flex:1, textAlign:'center', marginTop:50 }}>Loading...</Text>;

  const userName = session?.user?.user_metadata?.name || session?.user?.email || 'Utilisateur';

  const handleSend = async () => {
    if (!input.trim()) return;

    setResponses(prev => [...prev, `💬 ${input}`]); // message utilisateur

    try {
      const res = await fetch('https://n8n.projets-omega.net/webhook-test/assistant_mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          userName,
          question: input,
          sessionId: session.user.id // <-- ajout obligatoire pour n8n Simple Memory / AI Agent
        }),
      });

      // Lire la réponse brute
      const text = await res.text();
      console.log('Réponse brute du webhook:', text);

      // Essayer de parser en JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn('Impossible de parser le JSON, on utilise le texte brut.');
        data = { response: text };
      }

      // Afficher la réponse dans le chat
      setResponses(prev => [...prev, `🤖 ${data.response || text}`]);

    } catch (error) {
      console.error('Erreur lors de la requête vers n8n :', error);
      setResponses(prev => [...prev, '🤖 Erreur : impossible de contacter l’assistant.']);
    }

    setInput(''); // reset input après envoi
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={{ flex:1, backgroundColor:'#f2f2f7' }}>
      <Header title="Assistant IA" />

      <KeyboardAvoidingView
        style={{ flex:1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>👋 Bonjour {userName},</Text>
          <Text style={styles.subtitle}>Je suis ton assistant IA professionnel.</Text>

          <View style={styles.chatBox}>
            <ScrollView style={{ flex:1 }}>
              {responses.map((r, i) => {
                const isUser = r.startsWith('💬');
                return (
                  <View key={i} style={[styles.messageWrapper, isUser && styles.userMessageWrapper]}>
                    {isUser ? (
                      <LinearGradient colors={GRADIENT_COLORS} start={{x:0.1,y:0.8}} end={{x:0.9,y:0.2}} style={styles.userMessage}>
                        <Text style={styles.userMessageText}>{r}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.messageBox}>
                        <Text style={styles.messageText}>{r}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.inputRow}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0.1, y: 0.8 }}
              end={{ x: 0.9, y: 0.2 }}
              style={styles.inputGradient}
            >
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Posez une question..."
                placeholderTextColor="#fff"
                multiline
              />
            </LinearGradient>

            <TouchableOpacity activeOpacity={0.8} onPress={handleSend} style={styles.sendButton}>
              <LinearGradient colors={GRADIENT_COLORS} start={{x:0.1,y:0.8}} end={{x:0.9,y:0.2}} style={styles.btnGradient}>
                <Text style={styles.btnText}>Envoyer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <FooterNav active="assistant" onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f2f2f7', padding:16 },
  title: { fontSize:22, fontWeight:'bold', color:'#333' },
  subtitle: { fontSize:16, color:'#666', marginTop:4 },
  chatBox: { flex:1, backgroundColor:'#fff', borderRadius:16, padding:12, marginVertical:16, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10, shadowOffset:{width:-2,height:-2} },
  messageWrapper: { marginVertical:6 },
  messageBox: { padding:10, borderRadius:12, backgroundColor:'#f2f2f7', shadowColor:'#000', shadowOpacity:0.05, shadowRadius:5, shadowOffset:{width:-1,height:-1} },
  messageText: { color:'#333', fontSize:16 },
  userMessageWrapper: { alignSelf:'flex-end' },
  userMessage: { padding:10, borderRadius:12, shadowColor:'#5b36e8', shadowOpacity:0.25, shadowRadius:8, elevation:2 },
  userMessageText: { color:'#fff', fontSize:16 },
  inputRow: { flexDirection:'row', alignItems:'center', marginTop:8 },
  inputGradient: { flex:1, borderRadius:20, padding:1, marginRight:8 },
  input: { paddingHorizontal:12, paddingVertical:10, borderRadius:20, color:'#fff', minHeight:40 },
  sendButton: { borderRadius:20 },
  btnGradient: { paddingVertical:12, paddingHorizontal:20, borderRadius:20, alignItems:'center', justifyContent:'center', shadowColor:'#5b36e8', shadowOpacity:0.25, shadowRadius:10, elevation:3 },
  btnText: { color:'#fff', fontWeight:'bold', fontSize:16 },
});
   