import { deleteAccessTokenFromStorage } from "../../utils/accessToken";
import { Button } from "react-native";
import { useAuthContext } from "../authProvider/AuthProvider";
import { goalsReactiveVar } from "../../cache";
import { deleteGoalsFromStorage } from "../../utils/goalsStorage";
import { useApolloClient } from "@apollo/client";

function SignOutButton() {
  const auth = useAuthContext();
  const apolloClient = useApolloClient();

  async function handleSignOut() {
    await apolloClient.clearStore();
    await deleteGoalsFromStorage();
    await deleteAccessTokenFromStorage();
    auth.updateAccessTokenInContext("");
  }

  return <Button title="SignOut" onPress={handleSignOut}></Button>;
}

export default SignOutButton;
