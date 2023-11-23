import { deleteAccessTokenFromStorage } from "../../utils/accessToken";
import { Button } from "react-native";
import { useAuthContext } from "../authProvider/AuthProvider";
import { useApolloClient } from "@apollo/client";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessKey } from "../../constants";

function SignOutButton() {
  const auth = useAuthContext();
  const apolloClient = useApolloClient();

  async function handleSignOut() {
    console.log("singout button pressed");
    await deleteAccessTokenFromStorage();
    await apolloClient.clearStore();
    auth.updateAccessTokenInContext("");
  }

  return <Button title="SignOut" onPress={handleSignOut}></Button>;
}

export default SignOutButton;
