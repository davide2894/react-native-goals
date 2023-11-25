import Router from "./src/components/router/Router";
import { AuthProvider } from "./src/components/authProvider/AuthProvider";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
      {/* <SafeAreaProvider
        style={{
          backgroundColor: "red",
          marginTop: 25,
        }}>
      </SafeAreaProvider> */}
      <Router />
    </AuthProvider>
  );
}
