import { InMemoryCache, makeVar } from "@apollo/client";
import { GoalType } from "./types";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        read: () => goalsReactiveVar(),
      },
    },
  },
});

export const goalsReactiveVar = makeVar<Array<GoalType>>([]);
