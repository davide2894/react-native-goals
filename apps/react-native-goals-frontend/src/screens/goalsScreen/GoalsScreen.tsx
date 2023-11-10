import { View, Text, Alert } from "react-native";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { gql, useQuery } from "@apollo/client";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import { GoalType } from "../../types";

const USER_GOALS_QUERY = gql`
  query GoalsQuery {
    userGoals {
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

const HELLO_QUERY = gql`
  query helloQuery {
    hello
  }
`;

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
  const { loading, error, data } = useQuery(USER_GOALS_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: (response) => {
      if (response) {
        console.log("goals fetched correctly");
        console.log("goals response is as follows");
        console.log({ response: response.userGoals.length });
      }
    },
    onError: () => {
      console.log("there was an error fetching your goals");
      Alert.alert("there was an error fetching your goals");
    },
  });
  if (loading) {
    console.log("GoalsScreen --> loading goals for current logged user");
  } else if (error) {
    console.log("GoalsScreen --> there was an error while fetching goals");
    console.log({ error });
  } else {
    console.log(
      "GoalsScreen --> finished loading goals for current logged user"
    );
  }

  return (
    <View>
      <SignOutButton />
      <Text>Goals</Text>
      {!loading &&
        data?.userGoals?.map((goal: GoalType) => (
          <Goal key={goal.id} data={goal} />
        ))}
    </View>
  );
}

export default GoalsScreen;
