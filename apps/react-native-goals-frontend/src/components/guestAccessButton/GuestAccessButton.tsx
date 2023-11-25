// import ButtonIcon from "@components/buttonIcon/ButtonIcon";
// import { registerWithEmailAndPassword } from "@firebase";
// import { isSubmitting } from "@formSlice";
// import log from "@utils/log";
// import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { Alert, Pressable, Text, StyleSheet } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import { useAuthContext } from "../authProvider/AuthProvider";
import { REGISTER_USER } from "../../graphql/operations/mutations/registerUserMutation";

function GuestAccessButton() {
  console.log("guest access component rendered");
  const auth = useAuthContext();
  const [registerUserMutation] = useMutation(REGISTER_USER, {
    variables: {
      email: `reactdailygoaltrackerguestprofile${uuidv4()}11${uuidv4()}@yopmail.com`,
      password: `guestAccessPassword123${uuidv4()}`,
    },
    onCompleted: async (response) => {
      console.log("===========================================");
      console.log("completed the login mutation ");
      console.log({ loginResponse: response });
      if (response.register) {
        console.log({ loginResponse: response });
        // await saveAccessTokenToStorage(response.login?.access_token);
        // await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
        isFirstTimeAccessReactiveVar(false);
        auth.updateAccessTokenInContext(response.register?.access_token);
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

  async function handleGuestAccess() {
    console.log("guest user registration -> registering guest user");
    await registerUserMutation();
  }

  return (
    <Pressable style={styles.button} onPress={handleGuestAccess}>
      {/* <ButtonIcon iconName="score-decrease-button" /> */}
      <Text style={styles.text}>Continue as guest</Text>
    </Pressable>
  );
}

export default GuestAccessButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    height: 60,
  },
  text: {
    display: "flex",
    fontSize: 14,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
});
