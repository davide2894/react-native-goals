import * as SecureStore from "expo-secure-store";
import { accessTokenKey } from "../constants";

export async function saveAccessTokenToStorage(access_token: string) {
  return await SecureStore.setItemAsync(accessTokenKey, access_token);
}

export async function getAccessTokenFromStorage() {
  return await SecureStore.getItemAsync(accessTokenKey);
}

export async function deleteAccessTokenFromStorage() {
  await SecureStore.deleteItemAsync(accessTokenKey);
}
