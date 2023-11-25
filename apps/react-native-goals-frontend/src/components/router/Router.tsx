import { ApolloProvider } from "@apollo/client";
import AppStack from "../appStack/AppStack";
import { useAuthContext } from "../authProvider/AuthProvider";
import AuthStack from "../authStack/AuthStack";
import createApolloClient from "../../utils/apolloClient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

function Router() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("Router component rendered");
  const auth = useAuthContext();
  // const insets = useSafeAreaInsets();
  // const styles = StyleSheet.create({
  //   container: {
  //     padding: 5,
  //     marginTop: 20,
  //     // Paddings to handle safe area
  //     paddingTop: insets.top,
  //     paddingBottom: insets.bottom,
  //     paddingLeft: insets.left,
  //     paddingRight: insets.right,
  //   },
  // });

  console.log({
    msg: "Router:::::access token state from context is",
    value: auth.accessTokenStateValue,
  });

  const stackToShow = auth.accessTokenStateValue ? <AppStack /> : <AuthStack />;

  return (
    <ApolloProvider client={createApolloClient(auth)}>
      {stackToShow}
    </ApolloProvider>
  );
}

export default Router;
