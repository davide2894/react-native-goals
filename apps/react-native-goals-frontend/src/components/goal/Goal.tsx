import { useState } from "react";
import { GoalType, GoalsQueryResult } from "../../types";
import {
  TouchableHighlight,
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import trimString from "../../utils/trimString";
import { useMutation } from "@apollo/client";
import INCREMENT_SCORE_MUTATION from "../../graphql/mutations/incrementScoreMutation";
import DECREMENT_SCORE_MUTATION from "../../graphql/mutations/decrementScoreMutation";
import DELETE_GOAL_MUTATION from "../../graphql/mutations/deleteGoalMutation";
import RESET_SCORE_MUTATION from "../../graphql/mutations/resetScoreMutation";
import { useDebouncedCallback } from "use-debounce";

import { getAllGoalsInCache } from "../../cache";
import EDIT_GOAL_TITLE_MUTATION from "../../graphql/mutations/editGoalTitleMutation";

import { AntDesign } from "@expo/vector-icons";
import {
  caribbeanGreen,
  lightGray,
  outerSpace,
  white,
} from "../../style/colors";
import { displayGeneralErrorMessage } from "../../utils/ErrorMessages";
import { USER_GOALS_QUERY } from "../../graphql/operations/mutations/getGoalsQuery";

/**
 * TODO
 * [x] replace expo secure store to mmkv for storage: expo has too small of a limit for max storage string length
 * [x] bug: goal edit title -> space are not accepted
 * [x] bug: delete goal to db FOR GUEST USER doesn't work
 * [x] bug: reset goal to db FOR GUEST USER doesn't work
 * [x] bug: increase goal to db FOR GUEST USER db doesn't work
 * [x] bug: increase goal to db FOR GUEST USER db doesn't work
 * [x] bug: post edit goal title to db FOR GUEST USER db doesn't work
 * [x] tech debt: use async storage for user auth flows as well (currently still using expo securestore, which is wrong)
   [x] show user welcome message
    [x] registered -> "Welcome <user name>"
    [x] login -> "Welcome <user name>""
    [x] guest -> "Beware! This is a temporary account: when you logout all data will be lost. Be sure to register properly if you want to keep track of your goals consistently"
 * jwt: 
    [x] should i really use another type of storage that's not async storage for jwt?
    [x] set expiration to 1h and fix the expiration issue
        ---> [x] bug: fix user can register but gets cached goals from same old user (the one with a lot of goals)
        ---> [x] login doesn't work (see how to wrap it in auth guard if necessary)
        [x] add jwtAuthWithRefresh
        [x] test error cases
 * [x] style bug: bottom sheet -> figure out why is not consistent with the amout of screen it takes
 * [] cover project with unit tests
 * */

function Goal(props: { goal: GoalType }) {
  console.log("Goal.tsx -> rendering goal component");
  const goal = props.goal;
  const [editableTitleValue, setEditableTitleValue] = useState(goal.title);
  const [actualScoreState, setActualScorestate] = useState(goal.actualScore);
  const isComplete = actualScoreState === goal.maxScore;
  const shouldDisableDecreaseButton =
    actualScoreState === goal.minScore || isComplete;
  const shouldDisableIncreaseButton =
    actualScoreState === goal.maxScore || isComplete;
  const [incrementScoreMutation] = useMutation(INCREMENT_SCORE_MUTATION, {
    variables: {
      id: goal.id,
      newCurrentScore: actualScoreState,
    },
    update: (cache, { data }) => {
      const updatedGoal = data.incrementScore;
      const allGoalsInCache = getAllGoalsInCache();
      if (allGoalsInCache) {
        cache.writeQuery({
          query: USER_GOALS_QUERY,
          data: {
            userGoals: allGoalsInCache.userGoals.map((currentGoal) => {
              return currentGoal.id === updatedGoal.id
                ? updatedGoal
                : currentGoal;
            }),
          },
        });
      }
    },
    onCompleted: (res) => {
      console.log("increment goal score mutation completed");
      console.log("res");
      console.log(res);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [decrementScoreMutation] = useMutation(DECREMENT_SCORE_MUTATION, {
    variables: {
      id: goal.id,
      newCurrentScore: actualScoreState,
    },
    update: (cache, { data }) => {
      const updatedGoal = data.decrementScore;
      console.log("Goal.tsx -> decrement score mutation response");
      console.log(data);
      console.log({ updatedGoal });
      const allGoalsInCache = cache.readQuery<GoalsQueryResult>({
        query: USER_GOALS_QUERY,
      });
      if (allGoalsInCache) {
        cache.writeQuery({
          query: USER_GOALS_QUERY,
          data: {
            userGoals: allGoalsInCache.userGoals.map((currentGoal) => {
              return currentGoal.id === updatedGoal.id
                ? updatedGoal
                : currentGoal;
            }),
          },
        });
      }
    },
    onCompleted: (res) => {
      console.log("DECREMENT goal score mutation completed");
      console.log("res");
      console.log(res);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const [resetScoreMutation] = useMutation(RESET_SCORE_MUTATION, {
    variables: {
      goalId: goal.id,
    },
    update: (cache, { data }) => {
      console.log(data);
      const updatedGoal = data.resetScore;
      const allGoalsInCache = cache.readQuery<GoalsQueryResult>({
        query: USER_GOALS_QUERY,
      });
      if (allGoalsInCache) {
        cache.writeQuery({
          query: USER_GOALS_QUERY,
          data: {
            userGoals: allGoalsInCache.userGoals.map((currentGoal) => {
              return currentGoal.id === updatedGoal.id
                ? updatedGoal
                : currentGoal;
            }),
          },
        });
      }
    },
    onCompleted: (res) => {
      console.log({ res });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const [deleteGoalMutation] = useMutation(DELETE_GOAL_MUTATION, {
    variables: {
      goalId: goal.id,
    },
    update: (cache, { data }) => {
      const deletedGoal: GoalType = data.deleteGoal;
      const allGoalsInCache = cache.readQuery<GoalsQueryResult>({
        query: USER_GOALS_QUERY,
      });

      if (allGoalsInCache.userGoals) {
        cache.writeQuery({
          query: USER_GOALS_QUERY,
          data: {
            userGoals: allGoalsInCache.userGoals.filter(
              (goal) => goal.id !== deletedGoal.id
            ),
          },
        });
      }
    },
    onCompleted: (res) => {
      console.log({ res });
    },
    onError: (error) => {
      console.log({ error });
      displayGeneralErrorMessage();
    },
  });

  async function handleIncrementScore() {
    console.log(
      "Goal.tsx --> handleIncrementScore --> calling incrementScoreMutation"
    );
    await incrementScoreMutation();
  }

  const [editTitleMutation] = useMutation(EDIT_GOAL_TITLE_MUTATION, {
    variables: {
      goalId: goal.id,
      goalTitle: editableTitleValue,
    },
    update: (cache, { data }) => {
      const updatedGoal = data.editGoalTitle;
      const allGoalsInCache = cache.readQuery<GoalsQueryResult>({
        query: USER_GOALS_QUERY,
      });
      if (allGoalsInCache) {
        cache.writeQuery({
          query: USER_GOALS_QUERY,
          data: {
            userGoals: allGoalsInCache.userGoals.map((currentGoal) => {
              return currentGoal.id === updatedGoal.id
                ? updatedGoal
                : currentGoal;
            }),
          },
        });
      }
    },
    onCompleted: (res) => {
      console.log({ res });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const debouncedhandleIncrementScore = useDebouncedCallback(
    handleIncrementScore,
    500,
    { trailing: true }
  );

  const debouncedhandleDecrementScore = useDebouncedCallback(
    handleDecrementScore,
    500,
    { trailing: true }
  );

  const debouncedEditTitleMutation = useDebouncedCallback(
    editTitleMutation,
    500,
    { trailing: true }
  );

  const debouncedTitleTrim = useDebouncedCallback(function (text) {
    console.log({ text });
    const trimmedEventValue = trimString(text);
    if (trimmedEventValue && editableTitleValue !== trimmedEventValue) {
      console.log("setting new title state");
      setEditableTitleValue(trimmedEventValue);
    } else {
      console.log("not trimmed");
    }
  }, 500);

  function handleTitleTrimming(text) {
    console.log({ text });
    const trimmedEventValue = trimString(text);
    if (trimmedEventValue && editableTitleValue !== trimmedEventValue) {
      console.log("setting new title state");
      setEditableTitleValue(trimmedEventValue);
    } else {
      console.log("not trimmed");
    }
  }

  async function handleTitleChange(text) {
    console.log("handling title change");
    console.log(`current title text value: ${text}`);
    handleTitleTrimming(text);
    await debouncedEditTitleMutation();
  }

  async function handleDecrementScore() {
    console.log(
      "Goal.tsx --> handleIncrementScore --> calling incrementScoreMutation"
    );
    await decrementScoreMutation();
  }

  async function handleDeleteGoal() {
    await deleteGoalMutation();
  }

  async function handleResetGoal() {
    setActualScorestate(0);
    await resetScoreMutation();
  }

  return (
    <View
      data-testid="goalTest"
      style={
        isComplete
          ? { ...styles.container, backgroundColor: caribbeanGreen }
          : styles.container
      }>
      <TextInput
        style={
          isComplete
            ? {
                ...styles.title,
                ...styles.disabled,
              }
            : styles.title
        }
        editable={true}
        multiline={true}
        onChangeText={handleTitleChange}
        value={editableTitleValue}></TextInput>
      <View style={styles.actionsContainer}>
        <View
          style={
            isComplete
              ? { ...styles.scoreContainer, ...styles.disabled }
              : styles.scoreContainer
          }>
          <Text>Score: </Text>
          <View style={styles.score}>
            <Text>{actualScoreState}</Text>
            <Text>/</Text>
            <Text>{goal.maxScore}</Text>
          </View>
        </View>
        <View style={styles.scoreButtonsContainer}>
          <TouchableHighlight
            style={
              shouldDisableDecreaseButton
                ? { ...styles.scroreButton, ...styles.disabled }
                : styles.scroreButton
            }
            underlayColor={caribbeanGreen}
            accessibilityLabel="Decrease by 1"
            onPress={() => {
              setActualScorestate((prev) => prev - 1);
              debouncedhandleDecrementScore();
            }}
            disabled={shouldDisableDecreaseButton}>
            <AntDesign name="minuscircleo" size={24} color="black" />
          </TouchableHighlight>
          <TouchableHighlight
            accessibilityLabel="Increase by 1"
            style={
              shouldDisableIncreaseButton
                ? { ...styles.scroreButton, ...styles.disabled }
                : styles.scroreButton
            }
            underlayColor={caribbeanGreen}
            onPress={() => {
              setActualScorestate((prev) => prev + 1);
              debouncedhandleIncrementScore();
            }}
            disabled={shouldDisableIncreaseButton}>
            <AntDesign name="pluscircleo" size={24} color="black" />
          </TouchableHighlight>
          <TouchableHighlight
            accessibilityLabel="Reset goal"
            style={{ ...styles.scroreButton, ...styles.resetButton }}
            underlayColor={caribbeanGreen}
            onPress={handleResetGoal}>
            <AntDesign name="reload1" size={24} color="black" />
          </TouchableHighlight>
          <>
            <TouchableHighlight
              accessibilityLabel="Delete goal"
              style={{ ...styles.scroreButton, ...styles.deleteButton }}
              underlayColor={caribbeanGreen}
              onPress={handleDeleteGoal}>
              <AntDesign name="delete" size={24} color="black" />
            </TouchableHighlight>
          </>
        </View>
      </View>
    </View>
  );
}

export default Goal;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  button: {
    color: "black",
  },
  completedButtonColor: {
    color: caribbeanGreen,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  titleBlack: {
    color: outerSpace,
  },
  titleCompletedColor: {
    color: "green",
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
    alignItems: "baseline",
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    maxWidth: 80,
  },
  score: {
    display: "flex",
    flexDirection: "row",
  },
  scoreButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 12,
  },
  resetButton: {
    marginLeft: 12,
    borderWidth: 1,
  },
  deleteButton: {
    marginLeft: 12,
  },
  scroreButton: {
    display: "flex",
    borderRadius: 48,
    marginLeft: 10,
    borderWidth: 1,
    padding: 8,
  },
  disabled: {
    opacity: 0.2,
    pointerEvents: "none",
  },
});
