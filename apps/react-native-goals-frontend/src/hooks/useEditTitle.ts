import { useMutation } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import { GoalType } from "../types";
import EDIT_GOAL_TITLE_MUTATION from "../graphql/mutations/editGoalTitleMutation";

export default function useEditGoalTitle(goal: GoalType) {
  const [editGoalTitleMutation] = useMutation(EDIT_GOAL_TITLE_MUTATION, {
    refetchQueries: [USER_GOALS_QUERY],
    onCompleted: () => {
      console.log("edit goal score mutation completed");
    },
  });
  const debouncedDeletScoreMutation = useDebouncedCallback(
    editGoalTitleMutation,
    500,
    {
      trailing: true,
    }
  );

  return debouncedDeletScoreMutation;
}
