import React from "react";
import { Button, View, Text } from "react-native";
import { StyleSheet } from "react-native";

function HomeScreen({ navigation }) {
  function handlePress() {
    navigation.navigate("AuthScreen");
  }
  return (
    <View style={styles.container}>
      <Text>WELCOME TO DAILY GOAL TRACKER</Text>

      <Button title="Get Started" onPress={handlePress}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
