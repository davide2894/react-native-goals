import { Button, View, Text, RefreshControl, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

function HomeScreen({ navigation }) {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("HomeScreen component rendered");

  function handlePress() {
    console.log(
      "HomeScreen component rendered ---> button to GoalsScreen pressed"
    );
    console.log("HomeScreen component rendered ---> navigating to GoalsScreen");
    // if user is logged -> go to goals page
    // use logged stack (should contain goals screen)
    // else
    // use unlogged stack (should have auth screen)
    navigation.navigate("GoalsScreen");
  }

  return (
    <View style={styles.container}>
      <Text>WELCOME TO DAILY GOAL TRACKER</Text>

      <Button title="Get Started" onPress={handlePress}></Button>
      <ScrollView refreshControl={<RefreshControl refreshing={true} />}>
        <Text>Pull down to see RefreshControl indicator</Text>
      </ScrollView>
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
