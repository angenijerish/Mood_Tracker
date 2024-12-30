import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EntryScreen({ route, navigation }) {
    const [entry, setEntry] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const curDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const moods = [
        { id: 1, label: 'Happy 😊', color: '#ffbc42' },
        { id: 2, label: 'Sad 😢', color: '#16679a' },
        { id: 3, label: 'Angry 😡', color: '#d81159' },
        { id: 4, label: 'Relaxed 😌', color: '#028090' },
        { id: 5, label: 'Anxious 😟', color: '#e5009d' },
    ];

    const handleMoodSelect = (moodId) => {
        setSelectedMood(moodId);
    };

    const saveEntry = async () => {
        try {
            const selectedMoodObj = moods.find((mood) => mood.id === selectedMood);
    
            const newEntryData = {
                date: curDate,
                mood: selectedMoodObj?.label,
                entry,
                color: selectedMoodObj?.color,
                time: currentTime,
            };

            await AsyncStorage.setItem('dailyEntry', JSON.stringify(newEntryData));
            console.log('Entry saved successfully:', newEntryData);
    
            navigation.navigate('Screen1', { updatedEntry: newEntryData });
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    };

    const handleNext = async () => {
        await saveEntry();
    };

    const isButtonDisabled = !selectedMood;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Daily Entry ✍🏼</Text>
            <Text style={styles.prompt}>{curDate}</Text>

            <Text style={styles.subtitle}>How are you feeling?</Text>
            <View style={styles.moodContainer}>
                {moods.map((mood) => (
                    <Pressable
                        key={mood.id}
                        onPress={() => handleMoodSelect(mood.id)}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        style={[
                            styles.moodButton,
                            { backgroundColor: mood.color },
                            selectedMood === mood.id && styles.selectedMood,
                            { opacity: selectedMood ? 1 : 0.8 },
                        ]}
                    >
                        <Text style={styles.moodText}>{mood.label}</Text>
                    </Pressable>
                ))}
            </View>

            {selectedMood && (
                <TextInput
                    style={styles.input}
                    placeholder="Write something about your day... (Optional)"
                    value={entry}
                    onChangeText={(text) => setEntry(text)}
                />
            )}

            {selectedMood && (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Submit!"
                        onPress={handleNext}
                        color={isButtonDisabled ? '#ccc' : '#ecafcc'}
                        disabled={isButtonDisabled}
                    />
                </View>
            )}
            {isButtonDisabled && (
                <Text style={styles.warningText}>Please select a mood before submitting!</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffddd2',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#e29578',
        marginBottom: 20,
    },
    prompt: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    moodButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedMood: {
        borderColor: '#000',
    },
    moodText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
    },
    warningText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});
