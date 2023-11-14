import { useMutation, useQuery } from "@apollo/client";
import { Alert } from "react-native";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import {
  loadGoalsFromStorage,
  saveGoalsToStorage,
} from "../utils/goalsStorage";
import { updateLocalGoalState } from "../utils/goalState";
import { useEffect } from "react";
import INCREMENT_SCORE_MUTATION from "../graphql/mutations/incrementScoreMutation";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import useIncrementScore from "./useIncrementScore";
import useDecrementScore from "./useDecrementScore";
import useResetScore from "./useResetScore";
import useEditGoalTitle from "./useEditTitle";
import useDeleteGoal from "./useDeleteGoal";

export function useGoalService() {
  useEffect(() => {
    const loadGoalsFromLocalStorageAsync = async () =>
      await loadGoalsFromStorage();
    loadGoalsFromLocalStorageAsync();
  }, []);

  const queries = {
    getGoals: () => {
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
    },
  };

  const mutations = {
    useIncrementScore,
    useDecrementScore,
    useEditGoalTitle,
    useResetScore,
    useDeleteGoal,
  };

  return {
    queries,
    mutations,
  };
}
