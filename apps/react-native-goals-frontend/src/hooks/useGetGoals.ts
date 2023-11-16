import { useQuery } from "@apollo/client";
import { Alert } from "react-native";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import { updateLocalGoalState } from "../utils/goalState";
import { saveGoalsToStorage } from "../utils/goalsStorage";

function useGetGoals() {
  const { loading, error, data } = useQuery(USER_GOALS_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: async (response) => {
      if (response && response.length) {
        console.log("goals fetched correctly");
        console.log("goals response is as follows");
        console.log({ response: response.userGoals.length });
        updateLocalGoalState(data.userGoals);
        await saveGoalsToStorage(data.userGoals);
      }
    },
    onError: (error) => {
      console.log("there was an error fetching your goals", error);
      Alert.alert("there was an error fetching your goals");
    },
  });
  return { loading, error, data };
}

export default useGetGoals;
