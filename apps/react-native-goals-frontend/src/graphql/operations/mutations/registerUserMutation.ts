import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;
