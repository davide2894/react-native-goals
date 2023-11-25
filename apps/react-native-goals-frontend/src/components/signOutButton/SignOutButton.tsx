import { deleteAccessTokenFromStorage } from "../../utils/accessToken";
import { TouchableHighlight, StyleSheet } from "react-native";
import { useAuthContext } from "../authProvider/AuthProvider";
import { useApolloClient } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { caribbeanGreen } from "../../style/globals/color";

function SignOutButton() {
  const auth = useAuthContext();
  const apolloClient = useApolloClient();

  async function handleSignOut() {
    console.log("singout button pressed");
    await deleteAccessTokenFromStorage();
    await apolloClient.clearStore();
    auth.updateAccessTokenInContext("");
  }

  // return <Button title="SignOut" onPress={handleSignOut}></Button>;
  return (
    <TouchableHighlight
      style={styles.button}
      onPress={handleSignOut}
      underlayColor={caribbeanGreen}>
      <MaterialCommunityIcons name="logout-variant" size={24} color="black" />
    </TouchableHighlight>
  );
}

export default SignOutButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
  },
});
