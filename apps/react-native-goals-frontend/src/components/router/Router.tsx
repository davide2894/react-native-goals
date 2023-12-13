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
import { Alert, Text } from "react-native";
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
  mutation RefreshTokens($access_token: String!, $refresh_token: String!) {
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
      console.log(
        "inside Observer -> refreshToken -> trycach -> sending refreshTokens mutation..."
      );
      console.log("checking tokens status before sending the mutation");
      console.log({
        access_token: auth.authTokensStateValues.access_token,
        refresh_token: auth.authTokensStateValues.refresh_token,
      });
      const response = await client.mutate({
        mutation: REFRESH_TOKENS,
        variables: {
          access_token: auth.authTokensStateValues.access_token,
          refresh_token: auth.authTokensStateValues.refresh_token,
        },
      });

      if (response) {
        console.log({
          refreshedAT: response.data.refreshTokens.access_token,
          refreshedRT: response.data.refreshTokens.refresh_token,
        });
        await saveAccessTokenToStorage(
          response.data.refreshTokens.access_token
        );
        await saveRefreshTokenToStorage(
          response.data.refreshTokens.refresh_token
        );
        auth.updateAuthTokensInContext(
          response.data.refreshTokens.access_token,
          response.data.refreshTokens.refresh_token
        );
      }
    } catch (err) {
      console.log("one or both tokens are expired so we must log out user");
      console.log("going to call auth.resetAuthTokensInContext()");
      console.log({ err });
      Alert.alert("User tokens expired. Please login again :/");
      await deleteAccessTokenFromStorage();
      await deleteRefreshTokenFromStorage();
      await client.clearStore();
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

    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: "https://da54-93-149-132-59.ngrok-free.app/graphql",
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      console.log("\n\n\n");
      console.log("onError");
      console.log({ graphQLErrors });
      console.log({ networkError });
      console.log({ operationName: operation.operationName });
      console.log({ operationVariables: operation.variables });

      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            case "UNAUTHENTICATED":
              // ignore 401 error for a refresh request
              if (operation.operationName === "RefreshTokens") return;

              const observable = new Observable<
                FetchResult<Record<string, any>>
              >((observer) => {
                const tryRefreshToken = async () => {
                  console.log("\n");
                  console.log("inside the observer");
                  try {
                    console.log(
                      "sending refresh token graphql operation to server..."
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
              });
              return observable;
          }
        }
      }

      if (networkError && networkError.message.includes("401")) {
        console.log({ networkError });
        console.log({ networkErrName: networkError.name });
        console.log({ networkErrMessage: networkError.message });
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
