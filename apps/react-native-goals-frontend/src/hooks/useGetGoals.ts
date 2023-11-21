import { useQuery } from "@apollo/client";
import { Alert } from "react-native";
import { gql } from "@apollo/client";
import { updateLocalGoalState } from "../utils/goalState";

export const USER_GOALS_QUERY = gql`
  query GoalsQuery {
    userGoals {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

function useGetGoals() {
  const { loading, error, data } = useQuery(USER_GOALS_QUERY, {
    onCompleted: async (response) => {
      if (response && response.length) {
        console.log("goals fetched correctly");
        console.log("goals response is as follows");
        console.log({ response: response.userGoals.length });
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
