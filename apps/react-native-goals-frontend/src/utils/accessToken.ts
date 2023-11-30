import AsyncStorage from "@react-native-async-storage/async-storage";
import { accessTokenKey } from "../constants";

export async function saveAccessTokenToStorage(access_token: string) {
  return await AsyncStorage.setItem(accessTokenKey, access_token);
}

export async function getAccessTokenFromStorage() {
  return await AsyncStorage.getItem(accessTokenKey);
}

export async function deleteAccessTokenFromStorage() {
  return await AsyncStorage.removeItem(accessTokenKey);
}
