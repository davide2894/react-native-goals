import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Router from "./src/components/router/Router";
import AuthProvider from "./src/components/authProvider/AuthProvider";

export default function App() {
  const Stack = createNativeStackNavigator();
  const client = new ApolloClient({
    uri: "https://1baf-93-150-208-209.ngrok-free.app/graphql",
    cache: new InMemoryCache(),
  });

  console.log("App component rendered");

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ApolloProvider>
  );
}
