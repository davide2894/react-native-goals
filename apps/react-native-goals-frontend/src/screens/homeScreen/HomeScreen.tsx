import { useEffect } from "react";
import { Button, View, Text, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import { aquaHaze, outerSpace, white } from "../../style/globals/color";
import { useSharedValue, withSpring } from "react-native-reanimated";

function HomeScreen({ navigation }) {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("HomeScreen component rendered");
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    // setTimeout(
    //   () => (ring1padding.value = withSpring(ring1padding.value + (5))),
    //   1000
    // );
    setTimeout(() => {
      navigation.navigate("AuthScreen");
    }, 3000);
  });

  function handlePress() {
    console.log(
      "HomeScreen component rendered ---> button to GoalsScreen pressed"
    );
    console.log("HomeScreen component rendered ---> navigating to GoalsScreen");
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
        {/* <Text style={{ ...styles.h1, ...styles.subtitle }}>
          Track goals daily
        </Text> */}
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
    marginTop: 20,
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
