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
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { saveAccessTokenToStorage } from "../../utils/accessToken";
import { useAuthContext } from "../authProvider/AuthProvider";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessKey } from "../../constants";
import { formStyles } from "../../style/formCommonStyles";
import { lightGray } from "../../style/colors";
import { saveRefreshTokenToStorage } from "../../utils/refreshToken";
import { devModeLog } from "dev-mode-log";

const REGISTER_USER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;

export default function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuthContext();
  const apolloClient = useApolloClient();
  const [registerUserMutation] = useMutation(REGISTER_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: async (response) => {
      devModeLog({
        msg: "registered new user",
        newUserEmail: email,
        response,
      });
      if (response) {
        if (response.register) {
          devModeLog("successfully registered");
          devModeLog({ registrationInfo: response });
          await apolloClient.clearStore();
          await saveAccessTokenToStorage(response.register?.access_token);
          await saveRefreshTokenToStorage(response.register?.refresh_token);
          await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
          isFirstTimeAccessReactiveVar(false);
          auth.updateAuthTokensInContext(
            response.register?.access_token,
            response.register?.refresh_token
          );
        }
      }
    },
    onError: (error) => {
      devModeLog({
        msg: "ooops! There was a registration error",
        error,
      });
      Alert.alert(
        "There was an error during the registration process! \n\n Please try again"
      );
    },
  });

  const handleRegister = async () => {
    devModeLog("Registration button pressed");
    try {
      devModeLog("registering user");
      devModeLog("Email:", email);
      devModeLog("Password:", password);
      await registerUserMutation();
    } catch (error) {
      console.error(error);
    }
  };

  devModeLog("RegistrationForm component rendered");

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
