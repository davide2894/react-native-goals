import { useApolloClient, useMutation } from "@apollo/client";
import { Text, StyleSheet, TouchableHighlight } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import { useAuthContext } from "../authProvider/AuthProvider";
import { REGISTER_USER } from "../../graphql/operations/mutations/registerUserMutation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { caribbeanGreen } from "../../style/colors";
import { saveAccessTokenToStorage } from "../../utils/accessToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessKey } from "../../constants";
import { displayGeneralErrorMessage } from "../../utils/ErrorMessages";
import { saveRefreshTokenToStorage } from "../../utils/refreshToken";

function GuestAccessButton() {
  console.log("guest access component rendered");
  const auth = useAuthContext();
  const apolloClient = useApolloClient();
  const [registerUserMutation] = useMutation(REGISTER_USER, {
    variables: {
      email: `reactdailygoaltrackerguestprofile${uuidv4()}11${uuidv4()}@yopmail.com`,
      password: `guestAccessPassword123${uuidv4()}`,
    },
    onCompleted: async (response) => {
      console.log({
        msg: "registered new guest user",
        response,
      });
      if (response) {
        if (response.register) {
          console.log("successfully registered");
          console.log({ registrationInfo: response });
          await apolloClient.clearStore();
          await saveAccessTokenToStorage(response.register.access_token);
          await saveRefreshTokenToStorage(response.register.refresh_token);
          await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
          isFirstTimeAccessReactiveVar(false);
          auth.updateAuthTokensInContext(
            response.register.access_token,
            response.register.refresh_token
          );
        }
      }
    },
    onError: (error) => {
      console.log({
        msg: "ooops! There was a registration error",
        error,
      });
      displayGeneralErrorMessage();
    },
  });

  async function handleGuestAccess() {
    console.log("guest user registration -> registering guest user");
    await registerUserMutation();
  }

  return (
    <TouchableHighlight
      style={styles.button}
      onPress={handleGuestAccess}
      underlayColor={caribbeanGreen}>
      <>
        <MaterialCommunityIcons name="account" size={24} />
        <Text style={styles.text}>Continue as guest</Text>
      </>
    </TouchableHighlight>
  );
}

export default GuestAccessButton;

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    height: 60,
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginLeft: 8,
  },
});
