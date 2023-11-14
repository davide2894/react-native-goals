import { gql } from "@apollo/client";

const EDIT_GOAL_MUTATION = gql`
  mutation EditGoal($id, $title, $maxScore, $minScore, $actualScore) {
    editGoal(id: $id, title: $title, maxScore: $maxScore, minScore: $minScore, actualScore: $actualScore) {
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

export default EDIT_GOAL_MUTATION;
