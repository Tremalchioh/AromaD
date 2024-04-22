import React, { useState } from 'react';
import {View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import useAuthStore from "../data/UserStore";
import {useNavigation} from "@react-navigation/native";

const RegistrationScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const register = useAuthStore((state) => state.register);
    const navigation = useNavigation();

    const handleRegister = async () => {
        const success = await register(username, password);
        if (success) {
            Alert.alert('Успешно', 'В');
            navigation.goBack()
        } else {
            Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Имя пользователя"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    formContainer: {
        width: '80%',
        padding: 20,
        borderRadius: 0,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOffset: {
            width: 4,
            height: 7,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderBottomWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#000',
        backfaceVisibility: 'hidden',
        paddingVertical: 10,
        borderRadius: 0,
        marginTop: 5,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default RegistrationScreen;