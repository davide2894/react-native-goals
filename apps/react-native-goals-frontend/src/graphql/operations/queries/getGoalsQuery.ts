import { gql } from "@apollo/client";

export const USER_GOALS_QUERY = gql`
  query GoalsQuery {
    userGoals {
      id
      title
      maxScore
      minScore
      actualScore
      userIdRef
    }
  }
`;
