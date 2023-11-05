import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import GoalsScreen from "../../screens/goalsScreen/GoalsScreen";
import HomeScreen from "../../screens/homeScreen/HomeScreen";

function AppStack() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="GoalsScreen" component={GoalsScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
