import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoalsScreen from "../../screens/goalsScreen/GoalsScreen";

function AppStack() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("AppStack component rendered");

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GoalsScreen" component={GoalsScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
