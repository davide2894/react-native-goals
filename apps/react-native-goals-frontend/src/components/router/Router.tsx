import { ApolloProvider } from "@apollo/client";
import AppStack from "../appStack/AppStack";
import { useAuthContext } from "../authProvider/AuthProvider";
import AuthStack from "../authStack/AuthStack";
import createApolloClient from "../../utils/apolloClient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accessTokenKey } from "../../constants";
import { Text } from "react-native";

function Router() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("Router component rendered");
  const auth = useAuthContext();

  console.log({
    msg: "Router:::::access token state from context is",
    value: auth.accessTokenStateValue,
  });

  const content = auth.accessTokenStateValue ? <AppStack /> : <AuthStack />;

  if (auth.loading) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <ApolloProvider client={createApolloClient(auth)}>
        {content}
      </ApolloProvider>
    );
  }
}

export default Router;
