import { useMutation } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import { GoalType } from "../types";
import DECREMENT_SCORE_MUTATION from "../graphql/mutations/decrementScoreMutation";

export default function useDecrementScore(goal: GoalType) {
  const [decrementScoreMutation] = useMutation(DECREMENT_SCORE_MUTATION, {
    variables: {
      goal,
    },
    refetchQueries: [USER_GOALS_QUERY],
    onCompleted: () => {
      console.log("decrement goal score mutation completed");
    },
  });
  const debouncedDecrementScoreMutation = useDebouncedCallback(
    decrementScoreMutation,
    500,
    {
      trailing: true,
    }
  );

  return debouncedDecrementScoreMutation;
}
