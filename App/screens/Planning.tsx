import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TextInput, TouchableOpacity, Alert, Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../components/MainLayout';
import Header from '../components/Header';
import uuid from 'react-native-uuid';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_COLORS = ['#5b36e8', '#af36e8'];

export default function Planning() {
  const [session, setSession] = useState<any>(null);
  const [planning, setPlanning] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [plannedAt, setPlannedAt] = useState<Date>(new Date());
  const [type, setType] = useState('Rendez-vous'); 
  const [adding, setAdding] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

    if (error) Alert.alert('Erreur', error.message);
    else {
      setPlanning([data[0], ...planning]);
      setTitle('');
      setPlannedAt(new Date());
      setType('Rendez-vous');
      setShowForm(false);
    }

    setAdding(false);
  };

  const toggleDone = async (item: any) => {
    const { data, error } = await supabase
      .from('planning')
      .update({ done: !item.done })
      .eq('id', item.id)
      .select();

    if (error) Alert.alert('Erreur', error.message);
    else setPlanning(planning.map(p => p.id === item.id ? data[0] : p));
  };

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

  if (loading) return <ActivityIndicator size="large" color="#5b36e8" style={{ flex:1, justifyContent:'center', alignItems:'center' }} />;

  return (
    <MainLayout active="planning">
      {/* HEADER */}
      <Header title="Mon Planning" />

      <View style={styles.container}>
        {/* Bouton afficher formulaire */}
        {!showForm && (
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowForm(true)}>
            <LinearGradient colors={GRADIENT_COLORS} start={{x:0.1,y:0.8}} end={{x:0.9,y:0.2}} style={styles.btnGradient}>
              <Text style={styles.btnText}>➕ Ajouter un événement</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Formulaire */}
        {showForm && (
          <View style={styles.formBox}>
            <TextInput
              style={styles.input}
              placeholder="Titre (ex: Rendez-vous, Note...)"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color:'#333' }}>{plannedAt.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={{ color:'#333' }}>
                {plannedAt.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type (Rendez-vous, Note, Appel, Réunion)"
              placeholderTextColor="#888"
              value={type}
              onChangeText={setType}
            />
            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleAddItem} style={{ flex:1, marginRight:5 }}>
                <LinearGradient colors={GRADIENT_COLORS} start={{x:0.1,y:0.8}} end={{x:0.9,y:0.2}} style={styles.btnGradient}>
                  <Text style={styles.btnText}>{adding ? 'Ajout...' : 'Ajouter'}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setShowForm(false)} style={{ flex:1, marginLeft:5 }}>
                <LinearGradient colors={['#aaa','#777']} start={{x:0.1,y:0.8}} end={{x:0.9,y:0.2}} style={styles.btnGradient}>
                  <Text style={styles.btnText}>Annuler</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker value={plannedAt} mode="date" display="default" onChange={onChangeDate} minimumDate={new Date()} />
            )}
            {showTimePicker && (
              <DateTimePicker value={plannedAt} mode="time" display="default" onChange={onChangeTime} />
            )}
          </View>
        )}

        {/* Liste du planning */}
        {planning.length === 0 ? (
          <Text style={styles.emptyText}>Aucun élément planifié.</Text>
        ) : (
          <FlatList
            data={planning}
            keyExtractor={() => uuid.v4().toString()}
            renderItem={({ item }) => (
              <View style={styles.itemBox}>
                <Text style={styles.itemText}>[{item.type}] {item.title} {item.done ? '✅' : ''}</Text>
                <Text style={styles.itemDate}>{new Date(item.planned_at).toLocaleString()}</Text>
                {!item.done && (
                  <TouchableOpacity onPress={() => toggleDone(item)}>
                    <Text style={{ color: '#0f0', marginTop:4 }}>Marquer comme fait</Text>
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
  container: { flex:1, padding:16, backgroundColor:'#f2f2f7' },
  formBox: { backgroundColor:'#fff', padding:16, borderRadius:16, marginBottom:20, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10, shadowOffset:{width:-2,height:-2} },
  input: { backgroundColor:'#f2f2f7', padding:12, borderRadius:12, marginBottom:10, color:'#333' },
  btnGradient: { paddingVertical:12, borderRadius:12, alignItems:'center', justifyContent:'center', marginBottom:10, shadowColor:'#5b36e8', shadowOpacity:0.25, shadowRadius:10, elevation:3 },
  btnText: { color:'#fff', fontWeight:'bold', fontSize:16 },
  itemBox: { backgroundColor:'#fff', borderRadius:16, padding:12, marginBottom:12, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:8, shadowOffset:{width:-2,height:-2} },
  itemText: { fontSize:16, color:'#333' },
  itemDate: { fontSize:14, color:'#666', marginTop:4 },
  emptyText: { color:'#888', textAlign:'center', marginTop:20, fontSize:16 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:12, color:'#333' },
});
