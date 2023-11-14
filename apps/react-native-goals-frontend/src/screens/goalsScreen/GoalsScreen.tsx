import { View, Text, Alert } from "react-native";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { useQuery } from "@apollo/client";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import { GoalType } from "../../types";
import NewGoalButton from "../../components/newGoalButton/NewGoalButton";
import { USER_GOALS_QUERY } from "../../graphql/queries/userGoalsQuery";
import { useGoalService } from "../../hooks/useGoalService";

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

  const goals = useGoalService().queries.getGoals();

  if (goals.loading) {
    console.log("GoalsScreen --> loading goals for current logged user");
  } else if (goals.error) {
    console.log("GoalsScreen --> there was an error while fetching goals");
    console.log({ error: goals.error });
  } else {
    console.log(
      "GoalsScreen --> finished loading goals for current logged user"
    );
  }

  // TODO:
  // -develop goals flow (add, increment, decrement, updateAll)
  // -only then think about syncing backend

  return (
    <View>
      <SignOutButton />
      <Text>Goals</Text>
      {!goals.loading &&
        goals.data?.userGoals?.map((goal: GoalType) => (
          <Goal key={goal.id} goal={goal} />
        ))}
      <NewGoalButton />
    </View>
  );
}

export default GoalsScreen;
