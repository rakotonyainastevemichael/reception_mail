// /screens/Assistant.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../components/MainLayout';

export default function Assistant() {
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

  if (loading) return <Text style={{ color: '#fff' }}>Loading...</Text>;

  const userName = session?.user?.user_metadata?.name || session?.user?.email || 'Utilisateur';

  const handleSend = () => {
    // ici tu pourrais appeler ton API n8n ou IA
    setResponses([...responses, `💬 ${input}`, `🤖 Réponse: ${input} reçu !`]);
    setInput('');
  };

  return (
    <MainLayout active="assistant">
      <View style={styles.container}>
        <Text style={styles.text}>👋 Bonjour {userName},</Text>
        <Text style={styles.text}>Je suis ton assistant IA professionnel.</Text>

        <ScrollView style={{ flex: 1, width: '100%', marginTop: 20 }}>
          {responses.map((r, i) => (
            <Text key={i} style={styles.response}>{r}</Text>
          ))}
        </ScrollView>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Posez une question..."
          placeholderTextColor="#aaa"
        />
        <Button title="Envoyer" onPress={handleSend} />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#121212', padding: 10 },
  text: { color: '#fff', fontSize: 18, marginVertical: 6 },
  input: { backgroundColor: '#333', color: '#fff', width: '100%', padding: 10, borderRadius: 8, marginBottom: 10 },
  response: { color: '#fff', marginVertical: 4 },
});
