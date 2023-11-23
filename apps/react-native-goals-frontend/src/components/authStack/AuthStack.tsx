import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../../screens/authScreen/AuthScreen";
import HomeScreen from "../../screens/homeScreen/HomeScreen";
import { useReactiveVar } from "@apollo/client";
import { Fragment } from "react";
import { isFirstTimeAccessReactiveVar } from "../../cache";

function AuthStack() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("AuthStack component rendered");
  const Stack = createNativeStackNavigator();
  const isFirstAccess = useReactiveVar(isFirstTimeAccessReactiveVar);

  const homeScreen = (
    <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
  );
  const authScreen = (
    <Stack.Screen name="AuthScreen" component={AuthScreen}></Stack.Screen>
  );
  const firstAccessAuthStack = (
    <Fragment>
      {homeScreen}
      {authScreen}
    </Fragment>
  );

  console.log("logging firstAccessReactiveVar value");
  console.log({ isFirstAccess });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isFirstAccess ? firstAccessAuthStack : authScreen}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStack;
