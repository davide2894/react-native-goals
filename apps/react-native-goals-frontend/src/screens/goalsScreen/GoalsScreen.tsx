import { View, Text, StyleSheet, FlatList } from "react-native";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import { GoalType } from "../../types";
import NewGoalButton from "../../components/newGoalButton/NewGoalButton";
import useGetGoals from "../../hooks/useGetGoals";
import { Fragment } from "react";
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
    <View>
      <SignOutButton />
      <Text style={styles.header}>Goals</Text>
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
  header: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginBottom: 30,
    fontSize: 40,
    textDecorationLine: "underline",
  },
});
