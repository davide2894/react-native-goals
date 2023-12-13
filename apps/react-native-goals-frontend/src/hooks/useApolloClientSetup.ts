import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
  Observable,
  ServerError,
  FetchResult,
  gql,
  useMutation,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { AuthContextData } from "../types";
import { cache } from "../cache";
import {
  getRefreshTokenFromStorage,
  saveRefreshTokenToStorage,
} from "../utils/refreshToken";
import { saveAccessTokenToStorage } from "../utils/accessToken";
import { GraphQLError } from "graphql";

const REFRESH_TOKENS = gql`
  mutation ($access_token: String!, $refresh_token: String!) {
    refreshTokens(access_token: $access_token, refresh_token: $refresh_token) {
      access_token
      refresh_token
    }
  }
`;

export function useApolloClientSetup(
  auth: AuthContextData
): ApolloClient<NormalizedCacheObject> {
  const authParam = auth;

  const [refreshTokens] = useMutation(REFRESH_TOKENS, {
    onCompleted: async (res) => {
      // debug here to understand how tokens are received from backend and how to pass them correctly to storage
      console.log({ res });
      await saveAccessTokenToStorage(res.access_token);
      await saveRefreshTokenToStorage(res.refresh_token);
    },
    onError: () => {
      auth.updateAuthTokensInContext("");
    },
  });

  function setupAuthLink() {
    return new ApolloLink((operation, forward) => {
      console.log("App component ---> authLink --> new ApolloLink");
      console.log(
        "App component ---> authLink --> new ApolloLink --> this is the token from state, passed to the headers"
      );
      console.log(authParam.authTokensStateValues);

      operation.setContext(async ({ headers }) => ({
        headers: {
          ...headers,
          authorization: authParam.authTokensStateValues
            ? `Bearer ${authParam.authTokensStateValues}`
            : "",
          refreshToken: await getRefreshTokenFromStorage(),
        },
      }));
      return forward(operation);
    });
  }

  function setupHttpLink() {
    return new HttpLink({
      uri: "https://b1a5-93-148-111-254.ngrok-free.app/graphql",
    });
  }

  function setupErrorLink() {
    return onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            case "UNAUTHENTICATED":
              if (operation.operationName === "refreshToken") {
                return;
              }
              const observable = new Observable<
                FetchResult<Record<string, any>>
              >((observer) => {
                (async () => {
                  try {
                    const accessToken = await refreshTokens();

                    if (!accessToken) {
                      throw new GraphQLError("Empty access token");
                    }

                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                  } catch (err) {
                    observer.error(err);
                  }
                })();
              });
          }
        }
      }
    });
  }

  return new ApolloClient({
    cache,
    link: setupErrorLink().concat(setupAuthLink()).concat(setupHttpLink()),
    connectToDevTools: true,
  });
}
