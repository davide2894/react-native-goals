import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client";
import { AuthContextData } from "../types";
import { cache } from "../cache";

const createAuthLink = (auth: AuthContextData) =>
  new ApolloLink((operation, forward) => {
    console.log("App component ---> authLink --> new ApolloLink");
    console.log(
      "App component ---> authLink --> new ApolloLink --> this is the token from state, passed to the headers"
    );
    console.log(auth.accessTokenStateValue);
    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        authorization: auth.accessTokenStateValue
          ? `Bearer ${auth.accessTokenStateValue}`
          : "",
      },
    }));
    return forward(operation);
  });

const apiLink = new HttpLink({
  uri: "https://f81c-5-90-54-129.ngrok-free.app/graphql",
});

const createApolloClient = (auth) =>
  new ApolloClient({
    cache,
    link: createAuthLink(auth).concat(apiLink),
    connectToDevTools: true,
  });

export default createApolloClient;
