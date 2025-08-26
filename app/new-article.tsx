import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import axios, { AxiosError } from 'axios';

export default function NewArticle() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            await axios.post('https://api.crudme.mindlens.fr/posts', {
                title,
                content,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            router.push('/');
        } catch (error) {
            if (error instanceof AxiosError) {
                alert('Erreur lors de la création de l\'article : ' + error.message);
            } else {
                alert('Une erreur inattendue est survenue');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Titre de l'article"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Contenu de l'article"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={10}
            />
            <TouchableOpacity 
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Créer l'article</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    contentInput: {
        height: 200,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});