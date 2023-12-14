import Router from "./src/components/router/Router";
import { AuthProvider } from "./src/components/authProvider/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
   *  [x] modularize more the backend services file for user, goal, token
   *  [] add loader when waiting for goals to arrive in page
   * [] ui
   *  [] improve home animation screen
   * [] write polished readme with iphone usage mock screenshot
   */

  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <Router />
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
