import { useMutation } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import INCREMENT_SCORE_MUTATION from "../graphql/mutations/resetScoreMutation";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import { GoalType } from "../types";

export default function useResetScore(goal: GoalType) {
  const [resetScoreMutation] = useMutation(INCREMENT_SCORE_MUTATION, {
    variables: {
      goal,
    },
    refetchQueries: [USER_GOALS_QUERY],
    onCompleted: () => {
      console.log("reset goal score mutation completed");
    },
  });
  const debouncedResetScoreMutation = useDebouncedCallback(
    resetScoreMutation,
    500,
    {
      trailing: true,
    }
  );

  return debouncedResetScoreMutation;
}
