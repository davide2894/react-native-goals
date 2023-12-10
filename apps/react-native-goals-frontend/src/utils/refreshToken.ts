import * as SecureStore from "expo-secure-store";
import { refreshTokenKey } from "../constants";

export async function saveRefreshTokenToStorage(access_token: string) {
  return await SecureStore.setItemAsync(refreshTokenKey, access_token);
}

export async function getRefreshTokenFromStorage() {
  return await SecureStore.getItemAsync(refreshTokenKey);
}

export async function deleteRefreshTokenFromStorage() {
  console.log("accessToken.ts ---> deleteRefreshTokenFromStorage() called");

  await SecureStore.deleteItemAsync(refreshTokenKey);
}
