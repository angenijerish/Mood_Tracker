import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NameScreen from './NameScreen';
import Screen1 from './Screen1';
import EntryScreen from './EntryScreen';
import EntryDetailScreen from './EntryDetailScreen';
import PastEntriesScreen from './PastEntries';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const checkAndMoveEntry = async () => {
  try {
    const currentDate = new Date().toLocaleDateString();
    const dailyEntryData = await AsyncStorage.getItem('dailyEntry');
    
    if (dailyEntryData) {
      const parsedEntry = JSON.parse(dailyEntryData);

      if (parsedEntry.date !== currentDate) {
        const storedPastEntries = await AsyncStorage.getItem('pastEntries');
        const parsedPastEntries = storedPastEntries ? JSON.parse(storedPastEntries) : [];
        parsedPastEntries.push(parsedEntry);
        await AsyncStorage.setItem('pastEntries', JSON.stringify(parsedPastEntries));
        await AsyncStorage.removeItem('dailyEntry');
        console.log("Entry moved to past entries.");
      } else {
        console.log("It's still the current day, no need to move.");
      }
    }
  } catch (error) {
    console.error('Error checking and moving entry:', error);
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    checkAndMoveEntry();
    const checkLoginStatus = async () => {
      const userName = await AsyncStorage.getItem('userName');
      if (userName) {
        setIsLoggedIn(true); 
      } else {
        setIsLoggedIn(false); 
      }
      setLoading(false); 
    };

    checkLoginStatus(); 
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Screen1" : "NameScreen"}>
        <Stack.Screen name="NameScreen" component={NameScreen} />
        <Stack.Screen name="Screen1" component={Screen1} options={{ title: 'Welcome!' }} />
        <Stack.Screen name="EntryScreen" component={EntryScreen} />
        <Stack.Screen name="EntryDetailScreen" component={EntryDetailScreen} />
        <Stack.Screen name="PastEntries" component={PastEntriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
