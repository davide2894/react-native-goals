import { gql } from "@apollo/client";

const EDIT_GOAL_TITLE_MUTATION = gql`
  mutation EditGoalTitle($goalId: Int, $goalTitle: String) {
    editGoalTitle(goalId: $goalId, goalTitle: $goalTitle) {
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
