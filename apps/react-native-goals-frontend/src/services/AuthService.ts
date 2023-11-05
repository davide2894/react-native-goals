import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { saveAccessToken } from "../utils/accessToken";

const REGISTER_USER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
    }
  }
`;

const LOGIN_USER = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

async function register(email, password) {
  const [registerUserMutation] = useMutation(REGISTER_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: (response) => {
      console.log({
        msg: "registered new user",
        newUserEmail: email,
      });
      if (response) {
        if (response.login) {
          console.log("successfully registered");
          console.log({ registrationInfo: response });
        }
      }
    },
    onError: (error) => {
      console.log({
        msg: "ooops! There was a registration error",
      });
      Alert.alert(
        "There was an error during the registration process! \n\n Please try again"
      );
    },
  });

  const data = await registerUserMutation();

  //TODO: to understand how to retrieve the access token from there
  console.log({ data });

  //   if (data?.access_token) {
  //     saveAccessToken(data?.access_token);
  //   }

  // return retrieved access token
}

async function login(email, password) {
  const [loginUserMutation] = useMutation(LOGIN_USER, {
    variables: {
      email,
      password,
    },
    onCompleted: (response) => {
      console.log({
        msg: "Logged successfully",
        newUserEmail: email,
      });
      console.log({ loginResponse: response });
      if (response.login) {
        console.log("successfully logged in");
        console.log({ loginInfo: login });
      }
    },
    onError: (error) => {
      console.log({
        msg: "ooops! There was a login error",
      });
      Alert.alert(
        "There was an error during the login process! \n\n Please try again"
      );
    },
  });

  const data = await loginUserMutation();

  console.log({ access_token: data?.data?.login?.access_token });

  if (data?.data?.login?.access_token) {
    saveAccessToken(data?.data?.login?.access_token);
  }
}

export const authService = {
  register,
  login,
};
