import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function EntryDetailScreen({ route, navigation }) {
    const [entryData, setEntryData] = useState(route.params?.entryData || {});
    const curDate = new Date().toLocaleDateString();

    const handleEdit = () => {
        navigation.navigate('EntryScreen', { entryData });
    };

    useEffect(() => {
        console.log('Entry Data:', entryData);  
    }, [entryData]);

    const backgroundColor = entryData.color || '#f8f9fa';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.title}>Entry Details</Text>
            <Text style={styles.entryText}>
                <Text style={styles.label}>Date:</Text> {entryData.date || 'N/A'}
            </Text>
            <Text style={styles.entryText}>
                <Text style={styles.label}>Mood:</Text> {entryData.mood || 'N/A'}
            </Text>
            <Text style={styles.entryText}>
                <Text style={styles.label}>Time:</Text> {entryData.time || 'N/A'}
            </Text>
            <Text style={styles.entryText}>
                <Text style={styles.label}>Entry:</Text> {entryData.entry || 'No entry provided'}
            </Text>
            {entryData.date === curDate && (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Edit today's entry!"
                        onPress={handleEdit}
                        color="#ecafcc"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    buttonContainer: {
        marginTop: 20,
        width: '80%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    entryText: {
        fontSize: 18,
        marginBottom: 10,
        lineHeight: 24,
    },
    label: {
        fontWeight: 'bold',
    },
});
