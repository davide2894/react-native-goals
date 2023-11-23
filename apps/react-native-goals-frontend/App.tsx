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
import { SafeAreaProvider } from "react-native-safe-area-context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

export default function App() {
  console.log("------------------------------------------------------------");
  console.log("------------------------------------------------------------");
  console.log("------------------------------------------------------------");
  console.log("------------------------------------------------------------");
  console.log("App component rendered");

  /**
   * TODO:
   * [] style UI
   * [] monorepo: setup shorter names for startup commands
   *   [x] npm run start for backend
   *   [x] npm run start for frontend
   *   [] npm run start in root package.json that should execute backend and frontend in two different terminals
   * [] write polished readme with iphone usage mock screenshot
   */

  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
