import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TextInput, TouchableOpacity, Alert, Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../components/MainLayout';
import uuid from 'react-native-uuid';

export default function Planning() {
  const [session, setSession] = useState<any>(null);
  const [planning, setPlanning] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // 🔹 pour afficher le formulaire

  // Formulaire
  const [title, setTitle] = useState('');
  const [plannedAt, setPlannedAt] = useState<Date>(new Date());
  const [type, setType] = useState('Rendez-vous'); 
  const [adding, setAdding] = useState(false);

  // Picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 🔹 Charger le planning
  const fetchPlanning = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);

    if (session) {
      const { data, error } = await supabase
        .from('planning')
        .select('*')
        .eq('user_id', session.user.id)
        .order('planned_at', { ascending: true });

      if (error) console.error(error);
      else {
        // Marquer automatiquement les événements passés comme faits
        const updated = data.map(item => ({
          ...item,
          done: item.done || new Date(item.planned_at) < new Date()
        }));
        setPlanning(updated);
      }
    }

    setLoading(false);
  };

  useEffect(() => { fetchPlanning(); }, []);

  // 🔹 Ajouter un nouvel élément
  const handleAddItem = async () => {
    if (!title) {
      Alert.alert('Erreur', 'Le titre est requis.');
      return;
    }

    const now = new Date();
    if (plannedAt < now) {
      Alert.alert('Erreur', 'La date et l’heure doivent être dans le futur.');
      return;
    }

    setAdding(true);

    const { data, error } = await supabase
      .from('planning')
      .insert([
        {
          user_id: session.user.id,
          title,
          planned_at: plannedAt.toISOString(),
          type,
          done: false
        }
      ])
      .select();

    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      setPlanning([data[0], ...planning]);
      setTitle('');
      setPlannedAt(new Date());
      setType('Rendez-vous');
      setShowForm(false);
    }

    setAdding(false);
  };

  // 🔹 Marquer un événement comme fait/non fait
  const toggleDone = async (item: any) => {
    const { data, error } = await supabase
      .from('planning')
      .update({ done: !item.done })
      .eq('id', item.id)
      .select();

    if (error) Alert.alert('Erreur', error.message);
    else setPlanning(planning.map(p => p.id === item.id ? data[0] : p));
  };

  // 🔹 Pickers
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setPlannedAt(selectedDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(plannedAt);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setPlannedAt(newDate);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#563a8a" />;

  return (
    <MainLayout active="planning">
      <View style={styles.container}>
        <Text style={styles.title}>🗓️ Mon Planning</Text>

        {/* Bouton pour afficher le formulaire */}
        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addButtonText}>➕ Ajouter un événement</Text>
          </TouchableOpacity>
        )}

        {/* Formulaire */}
        {showForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Titre (ex: Rendez-vous, Note...)"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />

            {/* Boutons date/heure */}
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: '#fff' }}>{plannedAt.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={{ color: '#fff' }}>
                {plannedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type (Rendez-vous, Note, Appel, Réunion)"
              placeholderTextColor="#888"
              value={type}
              onChangeText={setType}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.addButton, { flex: 1, marginRight: 5 }]} onPress={handleAddItem} disabled={adding}>
                <Text style={styles.addButtonText}>{adding ? 'Ajout...' : 'Ajouter'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton, { flex: 1, backgroundColor: '#555', marginLeft: 5 }]} onPress={() => setShowForm(false)}>
                <Text style={styles.addButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>

            {/* DateTimePickers */}
            {showDatePicker && (
              <DateTimePicker
                value={plannedAt}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={plannedAt}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>
        )}

        {/* Liste du planning */}
        {planning.length === 0 ? (
          <Text style={{ color: '#aaa', marginTop: 20 }}>Aucun élément planifié.</Text>
        ) : (
          <FlatList
            data={planning}
            keyExtractor={() => uuid.v4().toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.text}>
                  [{item.type}] {item.title} {item.done ? '✅' : ''}
                </Text>
                <Text style={styles.date}>{new Date(item.planned_at).toLocaleString()}</Text>
                {!item.done && (
                  <TouchableOpacity onPress={() => toggleDone(item)}>
                    <Text style={{ color: '#0f0', marginTop: 4 }}>Marquer comme fait</Text>
                  </TouchableOpacity>
                )}
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
  text: { color: '#fff', fontSize: 16 },
  date: { color: '#aaa', fontSize: 14 },
});
