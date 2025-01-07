import React, { useState, useEffect } from 'react';
import { StatusBar, Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        elevation: 3, // Adds shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
    },
    image: {
        width: 100,
        height: 120,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 15,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
});

const Home = ({ navigation }) => {
    const [books, setBooks] = useState([]);

    const placeholderImage = 'https://via.placeholder.com/100x120.png?text=No+Image'; // Placeholder image

    // Load books from AsyncStorage
    const loadBooks = async () => {
        try {
            const storedBooks = await AsyncStorage.getItem('books');
            if (storedBooks) {
                console.log('Stored Books:', JSON.parse(storedBooks)); // Debugging
                setBooks(JSON.parse(storedBooks));
            } else {
                console.log('No books found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    // UseEffect to reload books on screen focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadBooks);
        return unsubscribe;
    }, [navigation]);

    // Helper function to validate image URL
    const validateImageUrl = (url) => {
        if (!url || url.trim() === '') {
            console.warn('Empty or missing image URL detected.');
            return placeholderImage;
        }
        return url;
    };

    // Render each book item
    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Edit', { book: item, index })}
        >
            <Image
                source={{ uri: validateImageUrl(item.imageUrl) }} // Validate image URL
                style={styles.image}
                onError={() => console.warn(`Failed to load image for ISBN: ${item.isbn}`)} // Debugging
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>ISBN: {item.isbn}</Text>
                <Text style={styles.subtitle}>Copies: {item.copies}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <StatusBar />
            <Text style={styles.header}>My Book Collection</Text>
            <Button title="Add Book" onPress={() => navigation.navigate('Add')} />
            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default Home;
