// import ButtonIcon from "@components/buttonIcon/ButtonIcon";
// import { registerWithEmailAndPassword } from "@firebase";
// import { isSubmitting } from "@formSlice";
// import log from "@utils/log";
// import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import {
  Alert,
  Pressable,
  Text,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import { useAuthContext } from "../authProvider/AuthProvider";
import { REGISTER_USER } from "../../graphql/operations/mutations/registerUserMutation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { caribbeanGreen } from "../../style/globals/color";

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

  console.log("guest access button rendered");

  return (
    <TouchableHighlight
      style={styles.button}
      onPress={handleGuestAccess}
      underlayColor={caribbeanGreen}>
      {/* <ButtonIcon iconName="score-decrease-button" /> */}
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
    width: "100%",
    height: 60,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginLeft: 8,
  },
});
