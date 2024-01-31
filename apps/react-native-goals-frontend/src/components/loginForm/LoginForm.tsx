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
import { formStyles } from "../../style/formCommonStyles";
import { saveRefreshTokenToStorage } from "../../utils/refreshToken";
import { devModeLog } from "dev-mode-log";

const LOGIN_USER = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;

export default function LoginForm() {
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("------------------------------------------------------------");
  devModeLog("LoginForm component rendered");

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
      devModeLog("===========================================");
      devModeLog("completed the login mutation ");
      devModeLog({ loginResponse: response });
      if (response.login) {
        devModeLog({ loginResponse: response });
        await apolloClient.clearStore();
        devModeLog({
          at: response.login.access_token,
          rt: response.login.refresh_token,
        });
        await saveAccessTokenToStorage(response.login.access_token);
        await saveRefreshTokenToStorage(response.login.refresh_token);
        await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
        isFirstTimeAccessReactiveVar(false);
        auth.updateAuthTokensInContext(
          response.login?.access_token,
          response.login?.refresh_token
        );
      }
    },
    onError: (error) => {
      devModeLog({
        msg: "ooops! There was a login error",
        error,
      });
      Alert.alert(
        "There was an error during the login process! \n\n Please try again"
      );
    },
  });

  const handleLogin = async () => {
    devModeLog("Login button pressed");
    try {
      devModeLog("handleLogin fn");
      devModeLog("logging user");
      devModeLog("Email:", email);
      devModeLog("Password:", password);

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
