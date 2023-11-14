import { gql } from "@apollo/client";

const ADD_GOAL_MUTATION = gql`
  mutation AddGoalScore($id, $newActualScore) {
    addGoalScore(id: $id, newActualScore: $newActualScore) {
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

export default ADD_GOAL_MUTATION;
