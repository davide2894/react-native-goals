import * as SecureStore from "expo-secure-store";

export async function saveAccessTokenToStorage(access_token: string) {
  return await SecureStore.setItemAsync("access_token", access_token);
}

export async function getAccessTokenFromStorage() {
  return await SecureStore.getItemAsync("access_token");
}

export async function deleteAccessTokenFromStorage() {
  await SecureStore.deleteItemAsync("access_token");
  console.log("storage -----> access token deleted from storage");
}
