import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFirstTimeAccessReactiveVar } from "../cache";
import { isFirstTimeAccessKey } from "../constants";
import { saveAccessTokenToStorage } from "../utils/accessToken";
import { saveRefreshTokenToStorage } from "../utils/refreshToken";
import { devModeLog } from "dev-mode-log";

async function useOnRegistrationEndOperations(
  apolloClient,
  graphQLOperationResponse,
  auth
) {
  devModeLog("successfully registered");
  devModeLog({ registrationInfo: graphQLOperationResponse });
  await apolloClient.clearStore();
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
