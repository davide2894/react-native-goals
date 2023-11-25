import React, { Fragment, useEffect, useState } from "react";
import { GoalType, GoalsQueryResult } from "../../types";
import {
  TouchableHighlight,
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import GoalForm from "../goalForm/GoalForm";
import trimString from "../../utils/trimString";
import { useMutation } from "@apollo/client";
import INCREMENT_SCORE_MUTATION from "../../graphql/mutations/incrementScoreMutation";
import DECREMENT_SCORE_MUTATION from "../../graphql/mutations/decrementScoreMutation";
import DELETE_GOAL_MUTATION from "../../graphql/mutations/deleteGoalMutation";
import RESET_SCORE_MUTATION from "../../graphql/mutations/resetScoreMutation";
import ButtonIcon from "../buttonIcon/ButtonIcon";
import { useDebouncedCallback } from "use-debounce";
import { USER_GOALS_QUERY } from "../../hooks/useGetGoals";
import { getAllGoalsInCache } from "../../cache";
import EDIT_GOAL_TITLE_MUTATION from "../../graphql/mutations/editGoalTitleMutation";

import { AntDesign } from "@expo/vector-icons";
import { caribbeanGreen, outerSpace } from "../../style/globals/color";

/**
 * TODO
 * [x] replace expo secure store to mmkv for storage: expo has too small of a limit for max storage string length
 * [] IMPORTANT jwt: set expiration to 1h and fix the expiration issue
 * [] fix warning:  WARN  Require cycle: src\hooks\useGetGoals.ts -> src\utils\goalState.ts -> src\cache.ts -> src\hooks\useGetGoals.ts
 * [] (Not necessary but it's a nice to have. this is the bottom of the priorities. the last thing I can approach but it's not essential to consider the project done.
 *    Refactor mutation files so that one file contains both the graphql statement and the apollo client hook
 * */

function Goal(props: { goal: GoalType }) {
  console.log("Goal.tsx -> rendering goal component");
  const goal = props.goal;
  const [showEditGoalForm, setShowEditGoalForm] = useState(false);
  const [editableTitleValue, setEditableTitleValue] = useState(goal.title);
  const [actualScoreState, setActualScorestate] = useState(goal.actualScore);
  const isComplete = actualScoreState === goal.maxScore;

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
      console.log({ error });
    },
  });

  const [decrementScoreMutation] = useMutation(DECREMENT_SCORE_MUTATION, {
    variables: {
      id: goal.id,
      newCurrentScore: actualScoreState,
    },
    update: (cache, { data }) => {
      const updatedGoal = data.incrementScore;
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
      const updatedGoal = data.incrementScore;
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

  const testTitleCssClasses = `text-lg goal-text ${
    isComplete ? "after:content-['✓'] after:ml-2" : ""
  }`;

  function onEditFormOpenHandler() {
    setShowEditGoalForm(true);
  }

  async function handleTitleChange(text) {
    const trimmedEventValue = trimString(text);
    if (trimmedEventValue && editableTitleValue !== trimmedEventValue) {
      setEditableTitleValue(trimmedEventValue);
    }
    await debouncedEditTitleMutation();
  }

  return (
    <View data-testid="goalTest" style={styles.container}>
      <TextInput
        style={{
          ...styles.title,
          ...(isComplete ? styles.titleCompletedColor : styles.titleBlack),
        }}
        editable={true}
        onChangeText={handleTitleChange}
        value={editableTitleValue}></TextInput>
      <View style={styles.actionsContainer}>
        <View style={styles.score}>
          <Text>{actualScoreState}</Text>
          <Text>/</Text>
          <Text>{goal.maxScore}</Text>
        </View>
        <View style={styles.scoreButtonsContainer}>
          <TouchableHighlight
            style={styles.scroreButton}
            underlayColor={caribbeanGreen}
            accessibilityLabel="Decrease by 1"
            onPress={() => {
              setActualScorestate((prev) => prev - 1);
              debouncedhandleDecrementScore();
            }}
            disabled={goal.actualScore === goal.minScore || isComplete}>
            <AntDesign name="minus" size={24} color="black" />
          </TouchableHighlight>
          <TouchableHighlight
            accessibilityLabel="Increase by 1"
            style={styles.scroreButton}
            underlayColor={caribbeanGreen}
            onPress={() => {
              setActualScorestate((prev) => prev + 1);
              debouncedhandleIncrementScore();
            }}
            disabled={actualScoreState === goal.maxScore || isComplete}>
            <AntDesign name="pluscircleo" size={24} color="black" />
          </TouchableHighlight>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableHighlight
            accessibilityLabel="Delete goal"
            style={styles.scroreButton}
            underlayColor={caribbeanGreen}
            onPress={handleDeleteGoal}>
            <AntDesign name="delete" size={24} color="black" />
          </TouchableHighlight>
          <TouchableHighlight
            accessibilityLabel="Reset goal"
            style={styles.scroreButton}
            disabled={goal.actualScore === 0}
            underlayColor={caribbeanGreen}
            onPress={handleResetGoal}>
            <AntDesign name="reload1" size={24} color="black" />
          </TouchableHighlight>
          {showEditGoalForm && (
            <Modal
              style={styles.modal}
              onRequestClose={() => setShowEditGoalForm(false)}>
              <GoalForm
                goalToEditId={goal.id}
                titleToEdit={goal.title}
                maxScoreToEdit={goal.maxScore.toString()}
                mode="edit"
                onGoalFormSubmit={() => setShowEditGoalForm(false)}
              />
            </Modal>
          )}
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
    padding: 10,
    maxWidth: "100%",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 20,
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
  score: {
    display: "flex",
    flexDirection: "row",
  },
  scoreButtonsContainer: {
    flexDirection: "row",
  },
  scroreButton: {
    display: "flex",
    borderRadius: 50,
    marginLeft: 10,
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  modal: {
    height: "80%",
  },
});
