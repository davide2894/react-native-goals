import { gql } from "@apollo/client";

const CREATE_GOAL_MUTATION = gql`
  mutation createGoal($goalTitle: String!, $maxScore: Int!) {
    createGoal(goalTitle: $goalTitle, maxScore: $maxScore) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default CREATE_GOAL_MUTATION;
