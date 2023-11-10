import {
  deleteAccessTokenFromStorage,
  getAccessTokenFromStorage,
} from "../../utils/accessToken";
import { Button } from "react-native";
import { useAuthContext } from "../authProvider/AuthProvider";

function SignOutButton() {
  const auth = useAuthContext();

  async function handleSignOut() {
    auth.logOut();
  }

  return <Button title="SignOut" onPress={handleSignOut}></Button>;
}

export default SignOutButton;
