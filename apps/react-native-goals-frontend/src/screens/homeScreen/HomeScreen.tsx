import { Button, View, Text, RefreshControl, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HomeScreen({ navigation }) {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("HomeScreen component rendered");
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",

      // Paddings to handle safe area
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
  });

  function handlePress() {
    console.log(
      "HomeScreen component rendered ---> button to GoalsScreen pressed"
    );
    console.log("HomeScreen component rendered ---> navigating to GoalsScreen");
    navigation.navigate("AuthScreen");
  }

  return (
    <ScrollView style={{ margin: 20 }}>
      <View style={styles.container}>
        <Text>WELCOME TO DAILY GOAL TRACKER</Text>

        <Button title="Get Started" onPress={handlePress}></Button>
        <ScrollView refreshControl={<RefreshControl refreshing={true} />}>
          <Text>Pull down to see RefreshControl indicator</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
