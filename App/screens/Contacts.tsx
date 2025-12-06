import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TextInput, TouchableOpacity, Alert 
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import FooterNav from '../components/FooterNav';
import uuid from 'react-native-uuid';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

export default function Contacts({ navigation }: any) {
  const [session, setSession] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadContacts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        if (error) console.error(error);
        else setContacts(data || []);
      }

      setLoading(false);
    };
    loadContacts();
  }, []);

  const handleSaveContact = async () => {
    if (!name || !email) {
      Alert.alert('Erreur', 'Le nom et l’email sont requis.');
      return;
    }

    setAdding(true);

    if (editingId) {
      const { data, error } = await supabase
        .from('contacts')
        .update({ name, email, phone: phone || null })
        .eq('id', editingId)
        .select();

      if (error) Alert.alert('Erreur', error.message);
      else {
        setContacts(contacts.map(c => c.id === editingId ? data[0] : c));
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ user_id: session.user.id, name, email, phone: phone || null }])
        .select();

      if (error) Alert.alert('Erreur', error.message);
      else {
        setContacts([data[0], ...contacts]);
        resetForm();
      }
    }

    setAdding(false);
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce contact ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive', 
          onPress: async () => {
            const { error } = await supabase.from('contacts').delete().eq('id', id);
            if (error) Alert.alert('Erreur', error.message);
            else setContacts(contacts.filter(c => c.id !== id));
          } 
        }
      ]
    );
  };

  const handleEditContact = (contact: any) => {
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone || '');
    setEditingId(contact.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  if (loading) return <ActivityIndicator size="large" color={GRADIENT_COLORS[0]} />;

  return (
    <View style={{ flex:1, backgroundColor:'#f2f2f7' }}>
      {/* HEADER */}
      <Header title="Contacts" />

      <View style={styles.container}>
        <Text style={styles.title}>👥 Mes Contacts</Text>

        {/* Ajouter Contact */}
        {!showForm && (
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowForm(true)}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0.1, y: 0.8 }}
              end={{ x: 0.9, y: 0.2 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>➕ Ajouter un contact</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Formulaire */}
        {showForm && (
          <View style={styles.formBox}>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone (optionnel)"
              placeholderTextColor="#666"
              value={phone}
              onChangeText={setPhone}
            />

            <View style={styles.row}>
              <TouchableOpacity style={{ flex: 1, marginRight: 6 }} activeOpacity={0.8} onPress={handleSaveContact} disabled={adding}>

                <LinearGradient
                  colors={GRADIENT_COLORS}
                  start={{ x: 0.1, y: 0.8 }}
                  end={{ x: 0.9, y: 0.2 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>{adding ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1, marginLeft: 6 }} activeOpacity={0.8} onPress={resetForm}>
                <View style={styles.btnCancel}>
                  <Text style={styles.btnTextCancel}>Annuler</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Liste */}
        {contacts.length === 0 ? (
          <Text style={styles.empty}>Aucun contact trouvé.</Text>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={() => uuid.v4().toString()}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardEmail}>{item.email}</Text>
                {item.phone && <Text style={styles.cardPhone}>{item.phone}</Text>}
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEditContact(item)}>
                    <Text style={styles.edit}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
                    <Text style={styles.delete}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* FOOTER */}
      <FooterNav active="contacts" onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 16 },

  formBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: -2, height: -2 },
  },

  input: {
    backgroundColor: '#fff',
    color: '#000',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: -2, height: -2 },
    elevation: 2,
  },

  row: { flexDirection: 'row', justifyContent: 'space-between' },

  btnGradient: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5b36e8',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },

  btnCancel: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnTextCancel: { color: '#333', fontWeight: 'bold' },

  empty: { textAlign: 'center', marginTop: 20, color: '#777' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 2 },
  },
  cardName: { fontSize: 17, fontWeight: 'bold', color: '#000' },
  cardEmail: { color: '#666', marginTop: 3 },
  cardPhone: { color: '#666', marginTop: 2 },

  actions: { flexDirection: 'row', marginTop: 10 },
  edit: { color: '#5b36e8', marginRight: 20, fontWeight: 'bold' },
  delete: { color: '#d40000', fontWeight: 'bold' },
});
