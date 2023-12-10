import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { isFirstTimeAccessReactiveVar } from "../cache";
import { isFirstTimeAccessKey } from "../constants";
import { saveAccessTokenToStorage } from "../utils/accessToken";
import apolloClient from "../utils/apolloClient";
import { saveRefreshTokenToStorage } from "../utils/refreshToken";

async function useOnRegistrationEndOperations(
  apolloClient,
  graphQLOperationResponse,
  auth
) {
  console.log("successfully registered");
  console.log({ registrationInfo: graphQLOperationResponse });
  await apolloClient.resetStore();
  await saveAccessTokenToStorage(
    graphQLOperationResponse.register.access_token
  );
  await saveRefreshTokenToStorage(
    graphQLOperationResponse.register.refresh_token
  );
  await AsyncStorage.setItem(isFirstTimeAccessKey, "false");
  isFirstTimeAccessReactiveVar(false);
  auth.updateAccessTokenInContext(
    graphQLOperationResponse.register.access_token
  );
}

export default useOnRegistrationEndOperations;
