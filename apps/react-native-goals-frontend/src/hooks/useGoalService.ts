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
import useGetGoals from "./useGetGoals";

export function useGoalService() {
  useEffect(() => {
    const loadGoalsFromLocalStorageAsync = async () =>
      await loadGoalsFromStorage();
    loadGoalsFromLocalStorageAsync();
  }, []);

  const queries = {
    getGoals: () => useGetGoals(),
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
