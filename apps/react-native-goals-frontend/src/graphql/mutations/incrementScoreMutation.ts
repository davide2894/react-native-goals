import { gql } from "@apollo/client";
import { USER_GOALS_QUERY } from "../queries/userGoalsQuery";

const INCREMENT_SCORE_MUTATION = gql`
  mutation IncrementGoalScore($id, $newActualScore) {
    incrementGoalScore(id: $id, newActualScore: $newActualScore) {
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

export default INCREMENT_SCORE_MUTATION;
