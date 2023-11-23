import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
      access_token
    }
  }
`;
