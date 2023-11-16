import { useMutation } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import { GoalType } from "../types";
import DELETE_GOAL_MUTATION from "../graphql/mutations/deleteGoalMutation";

export default function useDeleteGoal(goalId: number) {
  const [deleteGoalMutation] = useMutation(DELETE_GOAL_MUTATION, {
    variables: {
      goalId,
    },
    refetchQueries: [USER_GOALS_QUERY],
    onCompleted: () => {
      console.log("delete goal score mutation completed");
    },
  });
  const debouncedDeletScoreMutation = useDebouncedCallback(
    deleteGoalMutation,
    500,
    {
      trailing: true,
    }
  );

  return debouncedDeletScoreMutation;
}
