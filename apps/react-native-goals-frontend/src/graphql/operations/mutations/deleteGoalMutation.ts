import { gql } from "@apollo/client";

const DELETE_GOAL_MUTATION = gql`
  mutation DeleteGoal($goalId: Int!) {
    deleteGoal(goalId: $goalId) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default DELETE_GOAL_MUTATION;
