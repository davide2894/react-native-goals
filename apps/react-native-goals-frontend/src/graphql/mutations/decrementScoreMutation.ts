import { gql } from "@apollo/client";

const DECREMENT_SCORE_MUTATION = gql`
  mutation DecrementScore($id: Int, $newCurrentScore: Int) {
    decrementScore(inputStuff: { id: $id, newCurrentScore: $newCurrentScore }) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default DECREMENT_SCORE_MUTATION;
