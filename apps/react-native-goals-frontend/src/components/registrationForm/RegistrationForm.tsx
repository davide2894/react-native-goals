import { View, Text, TextInput, Button, StyleSheet, Pressable  } from "react-native";
import React, { useState } from 'react';
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
    mutation($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            email
        }
    }
`; 

export default function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerUser] = useMutation(REGISTER_USER, {
        variables: {
            email,
            password
        },
        onCompleted: () => {console.log({
            msg: 'registered new user',
            newUserEmail: email
        })},
    });
  
    const handleRegister = async () => {
        try {
            console.log('registering user');
            console.log('Email:', email);
            console.log('Password:', password);
    
            // Your asynchronous operation
            await registerUser();
            
            // Handle success if needed
            } catch (error) {
                // Handle error if needed
                console.error(error);
            }
        };
    
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Pressable style={styles.height} onPress={handleRegister}>
                <Text>Register</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    height: {
        height: 40,
    }
  });