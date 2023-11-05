import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import GoalsScreen from "../../screens/goalsScreen/GoalsScreen";
import { saveAccessToken } from "../../utils/accessToken";
import { authService } from "../../services/AuthService";

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login button pressed");
    try {
      console.log("logging user");
      console.log("Email:", email);
      console.log("Password:", password);
      await authService.login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("LoginForm component rendered");

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
      <Pressable style={styles.height} onPress={handleLogin}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  height: {
    height: 40,
  },
});
