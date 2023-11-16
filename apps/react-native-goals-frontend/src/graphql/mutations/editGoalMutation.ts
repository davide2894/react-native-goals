import { gql } from "@apollo/client";

const EDIT_GOAL_MUTATION = gql`
  mutation EditGoal(
    $id: Int
    $title: String
    $maxScore: Int
    $minScore: Int
    $actualScore: Int
  ) {
    editGoal(
      id: $id
      title: $title
      maxScore: $maxScore
      minScore: $minScore
      actualScore: $actualScore
    ) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default EDIT_GOAL_MUTATION;
