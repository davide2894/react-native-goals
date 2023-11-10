import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { saveAccessTokenToStorage } from "../utils/accessToken";

async function register(email, password) {
  const data = await registerUserMutation();
}

// export const authService = {
//   register,
//   login,
// };
