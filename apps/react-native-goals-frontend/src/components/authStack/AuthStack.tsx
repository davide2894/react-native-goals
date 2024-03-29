import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../../screens/authScreen/AuthScreen";
import HomeScreen from "../../screens/homeScreen/HomeScreen";
import { useReactiveVar } from "@apollo/client";
import { Fragment } from "react";
import { isFirstTimeAccessReactiveVar } from "../../cache";
import { white } from "../../style/colors";
import { devModeLog } from "dev-mode-log";

function AuthStack() {
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("------------------------------------------------------------");
  devModeLog("AuthStack component rendered");
  const Stack = createNativeStackNavigator();
  const isFirstAccess = useReactiveVar(isFirstTimeAccessReactiveVar);

  const homeScreen = (
    <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
  );
  const authScreen = (
    <Stack.Screen
      name="AuthScreen"
      options={{ contentStyle: { backgroundColor: white } }}
      component={AuthScreen}></Stack.Screen>
  );
  const firstAccessAuthStack = (
    <Fragment>
      {homeScreen}
      {authScreen}
    </Fragment>
  );

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "rgb(255, 45, 85)",
      background: "rgb(4, 184, 145)",
    },
  };

  devModeLog("logging firstAccessReactiveVar value");
  devModeLog({ isFirstAccess });

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstAccess ? firstAccessAuthStack : authScreen}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStack;
