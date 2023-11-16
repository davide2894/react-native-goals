import { View, Text, Alert } from "react-native";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import { GoalType } from "../../types";
import NewGoalButton from "../../components/newGoalButton/NewGoalButton";
import { useGoalService } from "../../hooks/useGoalService";
import useGetGoals from "../../hooks/useGetGoals";

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

  // TODO:
  // -develop goals flow (add, increment, decrement, updateAll)
  // -only then think about syncing backend

  return (
    <View>
      <SignOutButton />
      <Text>Goals</Text>
      {!loading &&
        data?.userGoals?.map((goal: GoalType) => (
          <Goal key={goal.id} goal={goal} />
        ))}
      <NewGoalButton />
    </View>
  );
}

export default GoalsScreen;
