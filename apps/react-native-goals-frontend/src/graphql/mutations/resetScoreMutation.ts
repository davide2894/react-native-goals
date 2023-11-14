import { gql } from "@apollo/client";

const RESET_GOAL_MUTATION = gql`
  mutation ResetGoal($id) {
    resetGoal(id: $id) {
      goal {
        title
        maxScore
        minScore
        actualScore
        userIdRef
      }
    }
  }
`;

export default RESET_GOAL_MUTATION;
