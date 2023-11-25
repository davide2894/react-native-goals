import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { saveAccessTokenToStorage } from "../../utils/accessToken";
import { useAuthContext } from "../authProvider/AuthProvider";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessKey } from "../../constants";
import GuestAccessButton from "../guestAccessButton/GuestAccessButton";
import { caribbeanGreen } from "../../style/globals/color";

const LOGIN_USER = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

export default function LoginForm() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("LoginForm component rendered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuthContext();
  const [loginUserMutation] = useMutation(LOGIN_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: async (response) => {
      console.log("===========================================");
      console.log("completed the login mutation ");
      console.log({ loginResponse: response });
      if (response.login) {
        console.log({ loginResponse: response });
        await saveAccessTokenToStorage(response.login?.access_token);
        await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
        isFirstTimeAccessReactiveVar(false);
        auth.updateAccessTokenInContext(response.login?.access_token);
      }
    },
    onError: (error) => {
      console.log({
        msg: "ooops! There was a login error",
        error,
      });
      Alert.alert(
        "There was an error during the login process! \n\n Please try again"
      );
    },
  });

  const handleLogin = async () => {
    console.log("Login button pressed");
    try {
      console.log("handleLogin fn");
      console.log("logging user");
      console.log("Email:", email);
      console.log("Password:", password);

      await loginUserMutation();
    } catch (error) {
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
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.defaultLoginButton}
        onPress={handleLogin}>
        <Text style={styles.defaultLoginButtonText}>Accedi</Text>
      </TouchableOpacity>
      <GuestAccessButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
    marginTop: 200,
  },
  input: {
    height: 70,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    marginBottom: 12,
    padding: 25,
  },
  defaultLoginButton: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 60,
    padding: 15,
    backgroundColor: caribbeanGreen,
  },
  defaultLoginButtonText: {
    display: "flex",
    textAlign: "center",
    color: "black",
  },
});
