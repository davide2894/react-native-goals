import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
      access_token
    }
  }
`;

export default function RegistrationForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUserMutation] = useMutation(REGISTER_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: (response) => {
      console.log({
        msg: "registered new user",
        newUserEmail: email,
      });
      if (response) {
        if (response.login) {
          console.log("successfully registered");
          console.log({ registrationInfo: response });
        }
      }
    },
    onError: (error) => {
      console.log({
        msg: "ooops! There was a registration error",
        error,
      });
      Alert.alert(
        "There was an error during the registration process! \n\n Please try again"
      );
    },
  });

  const handleRegister = async () => {
    console.log("Registration button pressed");
    try {
      console.log("registering user");
      console.log("Email:", email);
      console.log("Password:", password);
      await registerUserMutation();
    } catch (error) {
      console.error(error);
    }
  };

  console.log("RegistrationForm component rendered");

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
