import { InMemoryCache, makeVar } from "@apollo/client";
import {
  AsyncStorageWrapper,
  PersistentStorage,
  persistCache,
} from "apollo3-cache-persist";
import { GoalType, GoalsQueryResult } from "./types";
import * as SecureStore from "expo-secure-store";
import SecureStoreWrapper from "./utils/SecurestoreWrapper";
import { USER_GOALS_QUERY } from "./hooks/useGetGoals";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        read: () => goalsReactiveVar(),
      },
    },
  },
});

persistCache({
  cache,
  //TODO: open PR to https://github.com/apollographql/apollo-cache-persist to add SecureStoreWrapper
  storage: new SecureStoreWrapper(SecureStore),
}).then((res) => console.log(res));

export const goalsReactiveVar = makeVar<Array<GoalType>>([]);

export const getAllGoalsInCache = () => {
  return cache.readQuery<GoalsQueryResult>({
    query: USER_GOALS_QUERY,
  });
};
