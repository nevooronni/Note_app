import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const loadNotes = async () => {
    //load all saved notes from async storage
    try { 
      const keys = await AsyncStorage.getAllKeys()
      const savedNotes = await AsyncStorage.multiGet(keys)
      const notes = savedNotes?.map(note => JSON.parse(note[1]))
      setNotes(notes)
    } catch (error) {
      console.log(error)
    }
  }

  const saveNote = async () => {
    if (newNote.trim() === '') {
      Alert.alert('Error', 'Note cannot be emptly!')
      return;
    }

    //create new note object
    const note = {
      id: Date.now().toString(),
      text: newNote,
    }

    //save the note to async storage
    try {
      await AsyncStorage.setItem(note.id, JSON.stringify(note))
      setNotes([...notes, note])
      setNewNote('')
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNote = async (id) => {
    // remove the note from async storage
    try {
      await AsyncStorage.removeItem(id)
      setNotes(notes?.filter(note => note.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // load saved notes on app start
    loadNotes();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      // onPress={() => navigation.navigate('Note', { id: item.id })}
    >
      <Text style={styles.noteText}>{item.text}</Text>
      <TouchableOpacity
        onPress={() => deleteNote(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder='Enter a new note'
          value={newNote}
          onChangeText={setNewNote}
        />
        <TouchableOpacity style={styles.addButton} onPress={saveNote}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  listContainer: {
    width: 320,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  noteText: {
    width: 200
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 65,
    borderRadius: 5
  },
  deleteButtonText: {
    color: 'white',
  }
})
