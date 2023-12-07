import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  ServerError,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { AuthContextData } from "../types";
import { cache } from "../cache";
import { getRefreshTokenFromStorage } from "./refreshToken";

const createAuthLink = (auth: AuthContextData) =>
  new ApolloLink((operation, forward) => {
    console.log("App component ---> authLink --> new ApolloLink");
    console.log(
      "App component ---> authLink --> new ApolloLink --> this is the token from state, passed to the headers"
    );
    console.log(auth.accessTokenStateValue);

    operation.setContext(async ({ headers }) => ({
      headers: {
        ...headers,
        authorization: auth.accessTokenStateValue
          ? `Bearer ${auth.accessTokenStateValue}`
          : "",
        refreshToken: await getRefreshTokenFromStorage(),
      },
    }));
    return forward(operation);
  });

const apiLink = new HttpLink({
  uri: "https://b1a5-93-148-111-254.ngrok-free.app/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError && (networkError as ServerError).statusCode === 401) {
    // execute signout operationse
    // redirect to AuthScreen
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions }) => {
      if (extensions?.code === "UNAUTHENTICATED") {
        // Handle unauthenticated errors returned from GraphQL
        // You might want to trigger a re-login or some other authentication logic
      }
    });
  }
});

const createApolloClient = (auth) =>
  new ApolloClient({
    cache,
    link: createAuthLink(auth).concat(apiLink).concat(errorLink),
    connectToDevTools: true,
  });

export default createApolloClient;
