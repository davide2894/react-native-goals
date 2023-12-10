import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  Observable,
  ServerError,
  useMutation,
  FetchResult,
  gql,
} from "@apollo/client";
import AppStack from "../appStack/AppStack";
import { useAuthContext } from "../authProvider/AuthProvider";
import AuthStack from "../authStack/AuthStack";
import { Text } from "react-native";
import { onError } from "@apollo/client/link/error";
import { cache } from "../../cache";
import {
  deleteRefreshTokenFromStorage,
  getRefreshTokenFromStorage,
  saveRefreshTokenToStorage,
} from "../../utils/refreshToken";
import { GraphQLError } from "graphql";
import {
  deleteAccessTokenFromStorage,
  getAccessTokenFromStorage,
  saveAccessTokenToStorage,
} from "../../utils/accessToken";
import createApolloClient from "../../utils/apolloClient";
import apolloClient from "../../utils/apolloClient";

const REFRESH_TOKENS = gql`
  mutation ($access_token: String!, $refresh_token: String!) {
    refreshTokens(access_token: $access_token, refresh_token: $refresh_token) {
      access_token
      refresh_token
    }
  }
`;

function Router() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("Router component rendered");
  const auth = useAuthContext();

  console.log({
    msg: "Router:::::auth tokens state from context is",
    access_token: auth.authTokensStateValues.access_token,
    refresh_token: auth.authTokensStateValues.refresh_token,
  });

  const content = auth.authTokensStateValues.access_token ? (
    <AppStack />
  ) : (
    <AuthStack />
  );

  // -- APOLLO CLIENT SETUP //

  const refreshToken = async () => {
    try {
      const response = await client.mutate({
        mutation: REFRESH_TOKENS,
        variables: {
          access_token: await getAccessTokenFromStorage(),
          refresh_token: await getRefreshTokenFromStorage(),
        },
      });

      console.log({ clientMutateResponse: response });

      if (response) {
        console.log({ responseAfterRefreshingToken: response });
        await saveAccessTokenToStorage("response");
        await saveRefreshTokenToStorage("response");
        auth.updateAuthTokensInContext("access-token", "refresh-token");
      }
    } catch (err) {
      console.log("both tokens are expired so we must log out user");
      console.log("going to call auth.resetAuthTokensInContext()");
      console.log({ err });
      await deleteAccessTokenFromStorage();
      await deleteRefreshTokenFromStorage();
      await client.resetStore();
      auth.resetAuthTokensInContext();
    }
  };

  const authLink = new ApolloLink((operation, forward) => {
    console.log("App component ---> authLink --> new ApolloLink");
    console.log(
      "App component ---> authLink --> new ApolloLink --> this is the token from state, passed to the headers"
    );
    console.log(auth.authTokensStateValues);

    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        authorization: auth.authTokensStateValues.access_token
          ? `Bearer ${auth.authTokensStateValues.access_token}`
          : "",
        refreshToken: auth.authTokensStateValues.refresh_token,
      },
    }));
    console.log({ operationContext: operation.getContext() });

    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: "https://b1a5-93-148-111-254.ngrok-free.app/graphql",
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      console.log("\n\n\n");
      console.log("onError");
      console.log("\n\n\n");
      console.log({ graphQLErrors });
      console.log({ networkError });
      console.log({ operation });
      console.log("\n\n\n");
      console.log("\n\n\n");
      console.log("\n\n\n");
      console.log("\n\n\n");

      if (networkError && networkError.message.includes("401")) {
        console.log({ networkError });
        console.log(networkError.name);
        console.log(networkError.message);
        console.log({ operationName: operation.operationName });
        if (operation.operationName === "Register") {
          return;
        }
        console.log(
          "received 401 error, need to refresh token. Apporaching new Observable"
        );
        const observable = new Observable<FetchResult<Record<string, any>>>(
          (observer) => {
            const tryRefreshToken = async () => {
              console.log("\n");
              console.log("\n");
              console.log("\n");
              console.log("\n");
              console.log("inside the observer");
              try {
                console.log(
                  "sending refresh token   graphql operation to server..."
                );

                const token = await refreshToken();
                console.log({ token });
                // Retry the failed request
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              } catch (err) {
                observer.error(err);
              }
            };
            tryRefreshToken();
          }
        );
        return observable;
      }
    }
  );

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    connectToDevTools: true,
  });

  if (auth.loading) {
    return <Text>Loading...</Text>;
  } else {
    return <ApolloProvider client={client}>{content}</ApolloProvider>;
  }
}

export default Router;
