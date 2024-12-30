import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function PastEntries({ navigation }) {
  const [pastEntries, setPastEntries] = useState([]);

  const isPastEntry = (entryDate) => {
    if (!entryDate) return false;

    const currentDate = new Date().toLocaleDateString();
    return entryDate !== currentDate; 
  };

  // fetch past entries from AsyncStorage
  const fetchPastEntries = async () => {
    try {
      const storedPastEntries = await AsyncStorage.getItem('pastEntries');
      const parsedPastEntries = storedPastEntries ? JSON.parse(storedPastEntries) : [];

      // Filter out today's entry and keep past entries
      const filteredPastEntries = parsedPastEntries.filter(entry => isPastEntry(entry.date));

      console.log(filteredPastEntries);

      setPastEntries(filteredPastEntries);
    } catch (error) {
      console.error('Error fetching past entries:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPastEntries();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Past Entries</Text>
      {pastEntries.length === 0 ? (
        <Text style={styles.noEntriesText}>No past entries found.</Text>
      ) : (
        pastEntries.map((entry, index) => (
          <Pressable
            key={index}
            style={[styles.entryContainer, { backgroundColor: entry.color || '#cbf3f0' }]} // Default background if no color is available
            onPress={() => navigation.navigate('EntryDetailScreen', { entryData: entry })}
          >
            <Text style={styles.dateText}>Date: {entry.date}</Text>
            <Text style={styles.entryText}>Mood: {entry.mood}</Text>
            <Text style={styles.entryText}>Tap to view more details...</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#cbf3f0',
  },
  title: { 
    fontSize: 50,
    fontWeight: 'bold',
    color: '#38a3a5',
    marginBottom: 20,
  },
  noEntriesText: { 
    fontSize: 16, 
    color: '#555' 
  },
  entryContainer: { 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 8,
  },
  dateText: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  entryText: { 
    fontSize: 16, 
    marginBottom: 5 
  },
});
