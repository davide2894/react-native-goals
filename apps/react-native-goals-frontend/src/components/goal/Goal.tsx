import React, { Fragment, useEffect, useState } from "react";
import { GoalType } from "../../types";
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
import { USER_GOALS_QUERY } from "../../graphql/queries/userGoalsQuery";
import DECREMENT_SCORE_MUTATION from "../../graphql/mutations/decrementScoreMutation";
import DELETE_GOAL_MUTATION from "../../graphql/mutations/deleteGoalMutation";
import RESET_SCORE_MUTATION from "../../graphql/mutations/resetScoreMutation";
import ButtonIcon from "../buttonIcon/ButtonIcon";

/**
 *
 * TODO
 * [] after score increase -> refetch the current goal (not every single goal like it's happening now)
 * [] after score decrease -> refetch the current goal (not every single goal like it's happening now)
 * [] after score reset -> refetch the current goal (not every single goal like it's happening now)
 * [] after goal deletion
 *  [] -> remove goal from cache
 *  [] -> remove goal from frontend storage
 */

function Goal(props: { goal: GoalType }) {
  console.log("Goal.tsx -> rendering goal component");
  console.log({ goal: props.goal });
  const goal = props.goal;
  const [showEditGoalForm, setShowEditGoalForm] = useState(false);
  const [editableTitleValue, setEditableTitleValue] = useState(goal.title);
  const isComplete = goal.actualScore === goal.maxScore;
  const [incrementScoreMutation] = useMutation(INCREMENT_SCORE_MUTATION, {
    variables: {
      id: goal.id,
      newCurrentScore: goal.actualScore + 1,
    },
    refetchQueries: [USER_GOALS_QUERY],
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
      newCurrentScore: goal.actualScore - 1,
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
  const [resetScoreMutation] = useMutation(RESET_SCORE_MUTATION, {
    refetchQueries: [USER_GOALS_QUERY],
    variables: {
      goalId: goal.id,
    },
    onCompleted: (res) => {
      console.log({ res });
    },
    onError: (error) => {
      console.log({ error });
    },
  });
  const [deleteGoalMutation] = useMutation(DELETE_GOAL_MUTATION, {
    refetchQueries: [USER_GOALS_QUERY],
    variables: {
      goalId: goal.id,
    },
    onCompleted: (res) => {
      console.log({ res });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const testTitleCssClasses = `text-lg goal-text ${
    isComplete ? "after:content-['✓'] after:ml-2" : ""
  }`;

  function onEditFormOpenHandler() {
    setShowEditGoalForm(true);
  }

  function handleTitleChange(text) {
    const trimmedEventValue = trimString(text);
    if (trimmedEventValue && editableTitleValue !== trimmedEventValue) {
      setEditableTitleValue(trimmedEventValue);
    }
  }

  async function handleIncrementScore() {
    console.log(
      "Goal.tsx --> handleIncrementScore --> calling incrementScoreMutation"
    );
    await incrementScoreMutation();
  }

  async function handleDecrementScore() {
    console.log(
      "Goal.tsx --> handleDecrementScore --> calling decrementScoreMutation"
    );

    await decrementScoreMutation();
  }

  async function handleDeleteGoal() {
    await deleteGoalMutation();
  }

  async function handleResetGoal() {
    await resetScoreMutation();
  }

  // useEffect(() => {
  //   dispatch(updateGoalTitle({ id: goal.id, editableTitleValue }));
  //   return () => {};
  // }, [editableTitleValue, dispatch, goal.id]);

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
          <Text>{goal.actualScore}</Text>
          <Text>/</Text>
          <Text>{goal.maxScore}</Text>
        </View>
        <View>
          <Pressable
            style={styles.score}
            onPress={handleDecrementScore}
            disabled={goal.actualScore === goal.minScore || isComplete}>
            <ButtonIcon iconName="score-decrease-button" />
            <Text>Decrease by 1</Text>
          </Pressable>
          <Pressable
            style={styles.score}
            onPress={handleIncrementScore}
            disabled={goal.actualScore === goal.maxScore || isComplete}>
            <Text>increase score by 1</Text>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={handleDeleteGoal}>
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
    // fontSize: 20,
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
});
