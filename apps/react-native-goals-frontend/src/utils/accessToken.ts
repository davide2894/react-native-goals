import * as SecureStore from "expo-secure-store";
import { accessTokenKey } from "../constants";
import { devModeLog } from "dev-mode-log";

export async function saveAccessTokenToStorage(access_token: string) {
  return await SecureStore.setItemAsync(accessTokenKey, access_token);
}

export async function getAccessTokenFromStorage() {
  return await SecureStore.getItemAsync(accessTokenKey);
}

export async function deleteAccessTokenFromStorage() {
  devModeLog("accessToken.ts ---> deleteAccessTokenFromStorage() called");
  await SecureStore.deleteItemAsync(accessTokenKey);
}
