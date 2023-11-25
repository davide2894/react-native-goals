import { View, Text, StyleSheet, FlatList } from "react-native";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import NewGoalButton from "../../components/newGoalButton/NewGoalButton";
import useGetGoals from "../../hooks/useGetGoals";
import { useApolloClient } from "@apollo/client";

function GoalsScreen() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("GoalsScreen component rendered");
  console.log("GoalsScreen component --> retrieving auth context....");
  const auth = useAuthContext();
  console.log(
    "GoalsScreen component --> auth context retried in component is the following"
  );
  console.log({
    token: {
      state: auth.accessTokenStateValue,
    },
  });

  const { loading, error, data } = useGetGoals();
  const client = useApolloClient();

  console.log({ data });

  if (loading) {
    console.log("GoalsScreen --> loading goals for current logged user");
  } else if (error) {
    console.log("GoalsScreen --> there was an error while fetching goals");
    console.log({ error });
  } else {
    console.log(
      "GoalsScreen --> finished loading goals for current logged user"
    );
    console.log({ goals: data?.userGoals });
  }

  function handleRenderItem({ item, ..._ }) {
    // console.log({ currentRenderItem: item });
    return <Goal key={item.id} goal={item} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Goals</Text>
        <SignOutButton />
      </View>
      {!loading && !error && (
        <FlatList
          data={data.userGoals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={handleRenderItem}></FlatList>
      )}
      {!loading && !error && <NewGoalButton />}
    </View>
  );
}

export default GoalsScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  h1: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginBottom: 30,
    fontSize: 30,
  },
});
