import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../../screens/authScreen/AuthScreen";

function AuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AuthScreen" component={AuthScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStack;
