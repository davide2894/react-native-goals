import { gql } from "@apollo/client";

const EDIT_GOAL_TITLE_MUTATION = gql`
  mutation EditGoalTitle($newTitle: String) {
    editGoalTitle(newTitle: $newTitle) {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;

export default EDIT_GOAL_TITLE_MUTATION;
