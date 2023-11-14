import { goalsReactiveVar } from "../cache";
import { GoalType } from "../types";

export function updateLocalGoalState(updadetGoals: Array<GoalType>) {
  goalsReactiveVar(updadetGoals);
}
