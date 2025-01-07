import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Edit = ({ navigation, route }) => {
    const { book, index } = route.params || {};

    useEffect(() => {
        if (!book) {
            Alert.alert('Error', 'Invalid book data.', [
                {
                    text: 'Go Back',
                    onPress: () => navigation.navigate('Home'),
                },
            ]);
        }
    }, [book]);

    const [title, setTitle] = useState(book?.title || '');
    const [isbn, setIsbn] = useState(book?.isbn || '');
    const [copies, setCopies] = useState(book?.copies?.toString() || '');
    const [imageUrl, setImageUrl] = useState(book?.imageUrl || '');

    const saveChanges = async () => {
        if (!book) return; // Prevent further errors
        const updatedBook = { title, isbn, copies: parseInt(copies, 10), imageUrl };
        const storedBooks = await AsyncStorage.getItem('books');
        const books = JSON.parse(storedBooks);
        books[index] = updatedBook;
        await AsyncStorage.setItem('books', JSON.stringify(books));
        navigation.navigate('Home');
    };

    const deleteBook = async () => {
        Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async () => {
                    const storedBooks = await AsyncStorage.getItem('books');
                    const books = JSON.parse(storedBooks);
                    books.splice(index, 1);
                    await AsyncStorage.setItem('books', JSON.stringify(books));
                    navigation.navigate('Home');
                },
                style: 'destructive',
            },
        ]);
    };

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
            <Button title="Save Changes" onPress={saveChanges} />
            <Button title="Delete Book" onPress={deleteBook} color="red" />
        </View>
    );
};

export default Edit;
