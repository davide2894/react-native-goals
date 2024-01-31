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
  saveRefreshTokenToStorage,
} from "../../utils/refreshToken";
import {
  deleteAccessTokenFromStorage,
  saveAccessTokenToStorage,
} from "../../utils/accessToken";
import { debuglog } from "util";
import { devModeLog } from "dev-mode-log";

const REFRESH_TOKENS = gql`
  mutation RefreshTokens($access_token: String!, $refresh_token: String!) {
    refreshTokens(access_token: $access_token, refresh_token: $refresh_token) {
      access_token
      refresh_token
    }
  }
`;

function Router() {
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("------------------------------------------------------------");
  devModeLog("Router component rendered");
  const auth = useAuthContext();

  devModeLog({
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
      devModeLog(
        "inside Observer -> refreshToken -> trycach -> sending refreshTokens mutation..."
      );
      devModeLog("checking tokens status before sending the mutation");
      devModeLog({
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
        devModeLog({
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
      devModeLog("one or both tokens are expired so we must log out user");
      devModeLog("going to call auth.resetAuthTokensInContext()");
      devModeLog({ err });
      Alert.alert("User tokens expired. Please login again :/");
      await deleteAccessTokenFromStorage();
      await deleteRefreshTokenFromStorage();
      await client.clearStore();
      auth.resetAuthTokensInContext();
    }
  };

  const authLink = new ApolloLink((operation, forward) => {
    devModeLog("App component ---> authLink --> new ApolloLink");
    devModeLog(
      "App component ---> authLink --> new ApolloLink --> this is the token from state, passed to the headers"
    );
    devModeLog(auth.authTokensStateValues);

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
    uri: "https://13cf-93-67-213-59.ngrok-free.app/graphql",
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      devModeLog("\n\n\n");
      devModeLog("onError");
      devModeLog({ graphQLErrors });
      devModeLog({ networkError });
      devModeLog({ operationName: operation.operationName });
      devModeLog({ operationVariables: operation.variables });

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
                  devModeLog("\n");
                  devModeLog("inside the observer");
                  try {
                    devModeLog(
                      "sending refresh token graphql operation to server..."
                    );

                    const token = await refreshToken();
                    devModeLog({ token });
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
        devModeLog({ networkError });
        devModeLog({ networkErrName: networkError.name });
        devModeLog({ networkErrMessage: networkError.message });
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
