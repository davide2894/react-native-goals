import Router from "./src/components/router/Router";
import { AuthProvider } from "./src/components/authProvider/AuthProvider";
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
   * [] refactor:
   *  [x] use log helper from nextjs app to log messages only in dev environment (__DEV__)
   *  [] add loader when waiting for goals to arrive in page
   *  [] modularize more the backend services file for user, goal, token
   * [] ui
   *  [] improve home animation screen
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
