import * as SecureStore from "expo-secure-store";

export async function saveAccessToken(access_token: string) {
  return await SecureStore.setItemAsync("access_token", access_token);
}

export async function getAccessToken() {
  const access_token = await SecureStore.getItemAsync("access_token");
  return access_token || "";
}
