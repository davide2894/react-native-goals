import * as SecureStore from "expo-secure-store";
import { GoalType } from "../types";
import { goalStorageKey } from "../constants";

async function loadGoalsFromStorage() {
  try {
    return JSON.parse(await SecureStore.getItemAsync(goalStorageKey));
  } catch (error) {
    console.error("Error loading goals from storage:", error);
  }
}

async function saveGoalsToStorage(goals: Array<GoalType>) {
  try {
    return await SecureStore.setItemAsync(
      goalStorageKey,
      JSON.stringify(goals)
    );
  } catch (error) {
    console.error("Error loading goals from storage:", error);
  }
}

async function deleteGoalsFromStorage(goals: Array<GoalType>) {
  try {
    return await SecureStore.deleteItemAsync(goalStorageKey);
  } catch (error) {
    console.error("Error loading goals from storage:", error);
  }
}

export { loadGoalsFromStorage, saveGoalsToStorage };
