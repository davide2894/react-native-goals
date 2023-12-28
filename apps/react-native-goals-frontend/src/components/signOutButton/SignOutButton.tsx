import { deleteAccessTokenFromStorage } from "../../utils/accessToken";
import { TouchableHighlight, StyleSheet } from "react-native";
import { useAuthContext } from "../authProvider/AuthProvider";
import { useApolloClient } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { caribbeanGreen } from "../../style/colors";
import { deleteRefreshTokenFromStorage } from "../../utils/refreshToken";

function SignOutButton() {
  const auth = useAuthContext();
  const apolloClient = useApolloClient();

  async function handleSignOut() {
    console.log("singout button pressed");
    await deleteAccessTokenFromStorage();
    await deleteRefreshTokenFromStorage();
    await apolloClient.clearStore();
    auth.resetAuthTokensInContext();
  }

  return (
    <TouchableHighlight
      style={styles.button}
      onPress={handleSignOut}
      underlayColor={caribbeanGreen}>
      <MaterialCommunityIcons name="logout-variant" size={32} color="black" />
    </TouchableHighlight>
  );
}

export default SignOutButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    padding: 10,
  },
});
