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
   * [] write polished readme with iphone usage mock screenshot
   * [] refactor:
   *  [] use log helper from nextjs app to log messages only in dev environment (__DEV__)
   *  [] add loader when waiting for goals to arrive in page
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
