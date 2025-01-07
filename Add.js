import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

const Add = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [isbn, setIsbn] = useState('');
    const [copies, setCopies] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const saveBook = async () => {
        const newBook = { title, isbn, copies: parseInt(copies, 10), imageUrl };
        const storedBooks = await AsyncStorage.getItem('books');
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        books.push(newBook);
        await AsyncStorage.setItem('books', JSON.stringify(books));
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            <Text style={styles.label}>ISBN</Text>
            <TextInput style={styles.input} value={isbn} onChangeText={setIsbn} />
            <Text style={styles.label}>Number of Copies</Text>
            <TextInput style={styles.input} value={copies} onChangeText={setCopies} keyboardType="numeric" />
            <Text style={styles.label}>Image URL</Text>
            <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />
            <Button title="Save" onPress={saveBook} />
        </View>
    );
};

export default Add;
