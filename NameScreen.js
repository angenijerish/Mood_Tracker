import React, { useState, useEffect } from 'react';  
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as Font from 'expo-font'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NameScreen({ navigation }) {
  const [name, setName] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    console.log('NameScreen');
    // Load the custom font
    Font.loadAsync({
      'custom-font': require('./assets/fonts/PlaywriteCL-Regular.ttf'),  
    }).then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('userName', name);  
      navigation.reset({
        index: 0,
        routes: [{ name: 'Screen1' }], 
    });
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.prompt}>What is your name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your preferred name"
        accessibilityLabel="Name Input"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      {name ? (
        <Text style={styles.welcomeMessage}>Hello, {name}!</Text>
      ) : null}

      {name ? (
        <View style={styles.buttonContainer}>
          <Button 
            title="Let's get tracking!" 
            accessibilityLabel="Navigate to next screen"
            onPress={handleLogin}
            color="#ecafccff" 
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8e7cc3ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'custom-font',
  },
  prompt: {
    fontSize: 18,
    color: '#3d2a75ff',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3d2a75ff',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});
