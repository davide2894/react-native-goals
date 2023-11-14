import { gql } from "@apollo/client";

const DELETE_GOAL_MUTATION = gql`
  mutation DeleteGoal($id) {
    deleteGoal(id: $id) {
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

export default DELETE_GOAL_MUTATION;
