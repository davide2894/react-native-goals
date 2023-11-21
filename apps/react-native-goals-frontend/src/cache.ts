import { InMemoryCache, makeVar } from "@apollo/client";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";
import { GoalType, GoalsQueryResult } from "./types";
import { USER_GOALS_QUERY } from "./hooks/useGetGoals";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const cache = new InMemoryCache();

persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
}).then((res) => console.log(res));

export const goalsReactiveVar = makeVar<Array<GoalType>>([]);

export const getAllGoalsInCache = () => {
  return cache.readQuery<GoalsQueryResult>({
    query: USER_GOALS_QUERY,
  });
};
