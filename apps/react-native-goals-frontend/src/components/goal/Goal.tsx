import React, { Fragment, useEffect, useState } from "react";
import { GoalType, GoalsQueryResult } from "../../types";
import {
  Pressable,
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

/**
 * TODO
 * [] replace expo secure store to mmkv for storage: expo has too small of a limit for max storage string length
 * [] fix warning:  WARN  Require cycle: src\hooks\useGetGoals.ts -> src\utils\goalState.ts -> src\cache.ts -> src\hooks\useGetGoals.ts
 * [] style UI
 * [] (Not necessary but it's a nice to have. this is the bottom of the priorities. the last thing I can approach but it's not essential to consider the project done.
 *    Refactor mutation files so that one file contains both the graphql statement and the apollo client hook
 * [] jwt: set expiration to 1h and fix the expiration issue
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
      <View>
        <View>
          <Text>{actualScoreState}</Text>
          <Text>/</Text>
          <Text>{goal.maxScore}</Text>
        </View>
        <View>
          <Pressable
            style={styles.score}
            onPress={() => {
              setActualScorestate((prev) => prev - 1);
              debouncedhandleDecrementScore();
            }}
            disabled={goal.actualScore === goal.minScore || isComplete}>
            <ButtonIcon iconName="score-decrease-button" />
            <Text>Decrease by 1</Text>
          </Pressable>
          <Pressable
            style={styles.score}
            onPress={() => {
              setActualScorestate((prev) => prev + 1);
              debouncedhandleIncrementScore();
            }}
            disabled={actualScoreState === goal.maxScore || isComplete}>
            <Text>increase score by 1</Text>
          </Pressable>
        </View>
        <View>
          <Pressable style={styles.deleteButton} onPress={handleDeleteGoal}>
            <Text>delete goal</Text>
          </Pressable>
          <Pressable
            style={styles.score}
            disabled={goal.actualScore === 0}
            onPress={handleResetGoal}>
            <Text>reset goal</Text>
          </Pressable>
          {showEditGoalForm && (
            <Modal onRequestClose={() => setShowEditGoalForm(false)}>
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
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
    borderColor: "black",
    borderWidth: 5,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    color: "black",
  },
  completedButtonColor: {
    color: "green",
  },
  title: {
    fontSize: 18,
  },
  titleBlack: {
    color: "black",
  },
  titleCompletedColor: {
    color: "green",
  },
  score: {
    paddingBottom: 30,
  },
  scoreButtonsContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  },
  scoreButton: {
    marginRight: 2,
    marginLeft: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 2,
  },
  resetButton: {
    marginRight: 4,
  },
  deleteButton: {
    paddingBottom: 50,
  },
});
