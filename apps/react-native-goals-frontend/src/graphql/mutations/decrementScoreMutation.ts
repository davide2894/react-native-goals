import { gql } from "@apollo/client";

const DECREMENT_SCORE_MUTATION = gql`
  mutation DecrementGoalScore($id, $newScore) {
    decrementGoalScore(id: $id, newActualScore: $newActualScore) {
      updatedGoal {
        title
        maxScore
        minScore
        actualScore
        userIdRef
      }
    }
  }
`;

export default DECREMENT_SCORE_MUTATION;
