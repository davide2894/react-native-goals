import { InMemoryCache, makeVar } from "@apollo/client";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";
import { GoalsQueryResult } from "./types";
import { USER_GOALS_QUERY } from "./hooks/useGetGoals";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isFirstTimeAccessReactiveVar = makeVar(true);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isFirstAccessCachedValue: {
          read() {
            return isFirstTimeAccessReactiveVar();
          },
        },
      },
    },
  },
});

persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
}).then((res) => console.log(res));

export const getAllGoalsInCache = () => {
  return cache.readQuery<GoalsQueryResult>({
    query: USER_GOALS_QUERY,
  });
};
