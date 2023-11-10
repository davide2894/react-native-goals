import {
  ApolloLink,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import AppStack from "../appStack/AppStack";
import { useAuthContext } from "../authProvider/AuthProvider";
import AuthStack from "../authStack/AuthStack";

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

  const authLink = new ApolloLink((operation, forward) => {
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

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(apiLink),
  });

  const stackToShow = auth.accessTokenStateValue ? <AppStack /> : <AuthStack />;

  return <ApolloProvider client={client}>{stackToShow}</ApolloProvider>;
}

export default Router;
