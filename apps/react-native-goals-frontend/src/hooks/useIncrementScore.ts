import { useMutation } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import INCREMENT_SCORE_MUTATION from "../graphql/mutations/incrementScoreMutation";
import { USER_GOALS_QUERY } from "../graphql/queries/userGoalsQuery";
import { GoalType } from "../types";

function useIncrementScore(goalId: number, newCurrentScore: number) {
  const [incrementScoreMutation] = useMutation(INCREMENT_SCORE_MUTATION, {
    variables: {
      goalId,
      newCurrentScore,
    },
    refetchQueries: [USER_GOALS_QUERY],
    onCompleted: () => {
      console.log("increment goal score mutation completed");
    },
  });
  const debouncedIncrementScoreMutation = useDebouncedCallback(
    incrementScoreMutation,
    500,
    {
      trailing: true,
    }
  );

  return debouncedIncrementScoreMutation;
}

export default useIncrementScore;
