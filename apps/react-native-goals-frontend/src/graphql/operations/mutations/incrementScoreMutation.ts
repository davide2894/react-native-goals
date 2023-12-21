import { gql } from "@apollo/client";

const INCREMENT_SCORE_MUTATION = gql`
  mutation IncrementScore($id: Int, $newCurrentScore: Int) {
    incrementScore(inputStuff: { id: $id, newCurrentScore: $newCurrentScore }) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default INCREMENT_SCORE_MUTATION;
