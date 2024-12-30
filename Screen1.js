import React, { useState, useEffect, useCallback } from 'react';
import { Button, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';

export default function Screen1({ route, navigation }) {
  const [userName, setUserName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#fee2e2');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [savedEntry, setSavedEntry] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      } else {
        navigation.navigate('NameScreen');
      }
    };

    fetchUserName();
  }, []);

  const fetchDailyEntry = async () => {
    try {
        const entryData = await AsyncStorage.getItem('dailyEntry');
        if (entryData) {
            const parsedData = JSON.parse(entryData);
            setSavedEntry(parsedData);
            setBackgroundColor(parsedData.color || '#fee2e2'); 
        }
    } catch (error) {
        console.error('Error fetching daily entry:', error);
    }
};

  useFocusEffect(
    useCallback(() => {
      fetchDailyEntry();
    }, [])
  );

  // Greeting based on the time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setTimeOfDay('🌄 Good Morning');
      } else if (currentHour >= 12 && currentHour < 18) {
        setTimeOfDay('🌅 Good Afternoon');
      } else {
        setTimeOfDay('🌃 Good Evening');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleGoToEntry = () => {
    navigation.navigate('EntryScreen', { userName });
  };

  const handleEntryClick = () => {
    if (savedEntry) {
      navigation.navigate('EntryDetailScreen', { entryData: savedEntry });
    }
  };

  const handleLogout = async () => {
    alert("You are choosing to log out")
    await AsyncStorage.clear();
    navigation.reset({
      index: 0, 
      routes: [{ name: 'NameScreen' }],  
    });
  
  };

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.container}>
      
        <Text style={styles.title}>
          {timeOfDay} {userName}!
        </Text>

        <Text style={styles.subHeader}>Today's Entry:</Text>
        {savedEntry ? (
          <Pressable onPress={handleEntryClick} style={[styles.entryContainer, { backgroundColor }]}>
            <Text style={styles.dateText}>Date: {savedEntry.date}</Text>
            <Text style={styles.entryText}>Mood: {savedEntry.mood}</Text>
            <Text style={styles.entryText}>Tap to view more details...</Text>
          </Pressable>
        ) : (
          <View style={styles.buttonContainer}>
            <Text style={styles.noEntryText}>You haven't made an entry yet!</Text>
            <Button
              title="Start Daily Entry"
              onPress={handleGoToEntry}
              color="#b06f85"
            />
          </View>
        )}

        <Text style={styles.subHeader}>Past Entries:</Text>
        <Button title="View Past Entries" onPress={() => navigation.navigate('PastEntries')} />
      <Pressable onPress={handleLogout} style={styles.logOutButton}>
          <Text style={styles.logOutText}>Log Out</Text>
      </Pressable>
      <Text style={styles.warning}>*NOTE: Logging Out will get rid of all entries. This action is not reversible.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: '#fee2e2',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  entryContainer: {
    width: '80%',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  logOutButton: {
    width: '10%',
    height:'10%',
    backgroundColor:"#ef233c",
    padding: 5,
    marginTop: 50,
  },
  logOutText:{
    fontSize: 18,
    color: '#540b0e',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#b06f85',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 30,
    color: '#b06f85',
    paddingTop: 20,
  },
  warning: {
    fontSize: 15,
    color: '#000',
    paddingTop: 20,
  },
  dateText: {
    fontSize: 20,
    color: '#333',
    lineHeight: 28,
    textAlign: 'left',
    padding: 20,
  },
  entryText: {
    fontSize: 20,
    color: '#333',
    lineHeight: 28,
    padding: 20,
    textAlign: 'center',
  },
  noEntryText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
