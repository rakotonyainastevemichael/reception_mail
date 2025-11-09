// /screens/Contacts.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TextInput, TouchableOpacity, Alert 
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../components/MainLayout';
import uuid from 'react-native-uuid';

export default function Contacts() {
  const [session, setSession] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // 🔹 pour afficher le formulaire

  // Formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adding, setAdding] = useState(false);

  // Pour la modification
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

  // 🔹 Ajouter ou modifier un contact
  const handleSaveContact = async () => {
    if (!name || !email) {
      Alert.alert('Erreur', 'Le nom et l’email sont requis.');
      return;
    }

    setAdding(true);

    if (editingId) {
      // Modifier
      const { data, error } = await supabase
        .from('contacts')
        .update({ name, email, phone: phone || null })
        .eq('id', editingId)
        .select();

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        setContacts(contacts.map(c => c.id === editingId ? data[0] : c));
        resetForm();
      }
    } else {
      // Ajouter
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ user_id: session.user.id, name, email, phone: phone || null }])
        .select();

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        setContacts([data[0], ...contacts]);
        resetForm();
      }
    }

    setAdding(false);
  };

  // 🔹 Supprimer un contact
  const handleDeleteContact = (id: string) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce contact ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: async () => {
            const { error } = await supabase.from('contacts').delete().eq('id', id);
            if (error) Alert.alert('Erreur', error.message);
            else setContacts(contacts.filter(c => c.id !== id));
          } 
        }
      ]
    );
  };

  // 🔹 Préparer la modification
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

  if (loading) return <ActivityIndicator size="large" color="#563a8a" />;

  return (
    <MainLayout active="contacts">
      <View style={styles.container}>
        <Text style={styles.title}>👥 Mes Contacts</Text>

        {/* Bouton pour afficher le formulaire */}
        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addButtonText}>➕ Ajouter un contact</Text>
          </TouchableOpacity>
        )}

        {/* Formulaire d'ajout / modification */}
        {showForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone (optionnel)"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.addButton, { flex: 1, marginRight: 5 }]} onPress={handleSaveContact} disabled={adding}>
                <Text style={styles.addButtonText}>{adding ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton, { flex: 1, backgroundColor: '#555', marginLeft: 5 }]} onPress={resetForm}>
                <Text style={styles.addButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Liste des contacts */}
        {contacts.length === 0 ? (
          <Text style={{ color: '#aaa', marginTop: 20 }}>Aucun contact trouvé.</Text>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={() => uuid.v4().toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                {item.phone ? <Text style={styles.phone}>{item.phone}</Text> : null}
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => handleEditContact(item)} style={{ marginRight: 10 }}>
                    <Text style={{ color: '#0af' }}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
                    <Text style={{ color: '#f00' }}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  form: { marginBottom: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 10, marginBottom: 10, borderRadius: 8 },
  addButton: { backgroundColor: '#563a8a', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  name: { color: '#fff', fontSize: 16 },
  email: { color: '#aaa', fontSize: 14 },
  phone: { color: '#aaa', fontSize: 14 },
});
