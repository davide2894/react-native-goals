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
    <Pressable
      style={styles.button}
      onPress={handleGuestAccess}
      // className="mt-8 w-[255px] bg-yellow-500 px-4 py-2 border flex gap-2 rounded-sm text-black font-bold hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
    >
      {/* <ButtonIcon iconName="score-decrease-button" /> */}
      <Text>Continue as guest</Text>
    </Pressable>
  );
}

export default GuestAccessButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    border: "1px solid black",
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 300,
  },
});
