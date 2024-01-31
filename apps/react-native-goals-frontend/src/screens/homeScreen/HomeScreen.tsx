import { useEffect } from "react";
import { Button, View, Text, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import { aquaHaze, outerSpace, white } from "../../style/colors";
import { devModeLog } from "dev-mode-log";

function HomeScreen({ navigation }) {
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("------------------------------------------------------------");
  devModeLog("HomeScreen component rendered");

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("AuthScreen");
    }, 3000);
  });

  function handlePress() {
    devModeLog(
      "HomeScreen component rendered ---> button to GoalsScreen pressed"
    );
    devModeLog("HomeScreen component rendered ---> navigating to GoalsScreen");
    navigation.navigate("AuthScreen");
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
      }}>
      <View style={styles.container}>
        <Text style={{ ...styles.homeText, ...styles.h1 }}>Native Goals</Text>
        <Button
          color="#eaf4f2"
          title="Get Started"
          onPress={handlePress}></Button>
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    padding: 20,
  },
  homeText: {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    color: white,
  },
  h1: {
    fontSize: 50,
    fontWeight: "700",
    color: outerSpace,
  },
  subtitle: {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    color: aquaHaze,
    fontSize: 20,
    borderBottomColor: "#17211e",
    borderBottomWidth: 5,
  },
});
