import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { saveAccessTokenToStorage } from "../../utils/accessToken";
import { useAuthContext } from "../authProvider/AuthProvider";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessKey } from "../../constants";
import GuestAccessButton from "../guestAccessButton/GuestAccessButton";
import { formStyles } from "../../style/formCommonStyles";

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
  const apolloClient = useApolloClient();
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
        await apolloClient.resetStore();
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
    <View
      style={{
        ...formStyles.container,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={formStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={formStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={formStyles.submitButton}
          onPress={handleLogin}>
          <Text style={formStyles.submitText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
