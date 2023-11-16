import { deleteAccessTokenFromStorage } from "../../utils/accessToken";
import { Button } from "react-native";
import { useAuthContext } from "../authProvider/AuthProvider";
import { goalsReactiveVar } from "../../cache";

function SignOutButton() {
  const auth = useAuthContext();

  async function handleSignOut() {
    auth.logOut();
    goalsReactiveVar([]);
    await deleteAccessTokenFromStorage();
    await deleteGoalsFromStorage();
  }

  return <Button title="SignOut" onPress={handleSignOut}></Button>;
}

export default SignOutButton;
function deleteGoalsFromStorage() {
  throw new Error("Function not implemented.");
}
