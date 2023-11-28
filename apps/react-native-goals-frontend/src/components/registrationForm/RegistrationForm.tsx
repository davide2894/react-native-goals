import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { saveAccessTokenToStorage } from "../../utils/accessToken";
import { useAuthContext } from "../authProvider/AuthProvider";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessKey } from "../../constants";
import { formStyles } from "../../style/formCommonStyles";
import { lightGray } from "../../style/colors";

const REGISTER_USER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
      access_token
    }
  }
`;

export default function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuthContext();
  const [registerUserMutation] = useMutation(REGISTER_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: async (response) => {
      console.log({
        msg: "registered new user",
        newUserEmail: email,
        response,
      });
      if (response) {
        if (response.register) {
          console.log("successfully registered");
          console.log({ registrationInfo: response });
          await saveAccessTokenToStorage(response.register?.access_token);
          await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
          isFirstTimeAccessReactiveVar(false);
          auth.updateAccessTokenInContext(response.register?.access_token);
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
    <View
      style={{
        ...formStyles.container,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 16,
        marginTop: 60,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          autoFocus={true}
          style={formStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={lightGray}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={lightGray}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={formStyles.submitButton}
          onPress={handleRegister}>
          <Text style={formStyles.submitText}>Register</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  height: {
    height: 80,
  },
});
