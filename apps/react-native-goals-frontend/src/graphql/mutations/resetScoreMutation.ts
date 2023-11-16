import { gql } from "@apollo/client";

const RESET_SCORE_MUTATION = gql`
  mutation ResetScore($goalId: Int!) {
    resetScore(goalId: $goalId) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default RESET_SCORE_MUTATION;
