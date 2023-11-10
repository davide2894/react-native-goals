import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import Router from "./src/components/router/Router";
import {
  AuthProvider,
  useAuthContext,
} from "./src/components/authProvider/AuthProvider";
import AuthContext from "./src/contexts/authContext";
import React, { createContext, useContext, useEffect, useState } from "react";

export default function App() {
  console.log("------------------------------------------------------------");
  console.log("------------------------------------------------------------");
  console.log("------------------------------------------------------------");
  console.log("------------------------------------------------------------");
  console.log("App component rendered");

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
