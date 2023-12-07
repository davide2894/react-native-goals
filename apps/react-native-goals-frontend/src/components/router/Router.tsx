import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  ServerError,
} from "@apollo/client";
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
import { onError } from "@apollo/client/link/error";
import { cache } from "../../cache";
import { AuthContextData } from "../../types";
import { getRefreshTokenFromStorage } from "../../utils/refreshToken";
import { useApolloClientSetup } from "../../hooks/useApolloClientSetup";

function Router() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("Router component rendered");
  const auth = useAuthContext();
  const apolloClientSetup = useApolloClientSetup(auth);

  console.log({
    msg: "Router:::::access token state from context is",
    value: auth.accessTokenStateValue,
  });

  const content = auth.accessTokenStateValue ? <AppStack /> : <AuthStack />;

  if (auth.loading) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <ApolloProvider client={apolloClientSetup}>{content}</ApolloProvider>
    );
  }
}

export default Router;
