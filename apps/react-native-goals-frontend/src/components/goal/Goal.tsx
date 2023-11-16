import React, { Fragment, useEffect, useState } from "react";
import { GoalType } from "../../types";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import GoalForm from "../goalForm/GoalForm";
import trimString from "../../utils/trimString";
import useIncrementScore from "../../hooks/useIncrementScore";
import useDecrementScore from "../../hooks/useDecrementScore";
import useDeleteGoal from "../../hooks/useDeleteGoal";
import useResetScore from "../../hooks/useResetScore";
import { useGoalService } from "../../hooks/useGoalService";
import { useMutation } from "@apollo/client";
import INCREMENT_SCORE_MUTATION from "../../graphql/mutations/incrementScoreMutation";
import { USER_GOALS_QUERY } from "../../graphql/queries/userGoalsQuery";
import DECREMENT_SCORE_MUTATION from "../../graphql/mutations/decrementScoreMutation";
import DELETE_GOAL_MUTATION from "../../graphql/mutations/deleteGoalMutation";
import RESET_GOAL_MUTATION from "../../graphql/mutations/resetScoreMutation";
import RESET_SCORE_MUTATION from "../../graphql/mutations/resetScoreMutation";
import { goalsReactiveVar } from "../../cache";
function Goal(props: { goal: GoalType }) {
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
  // const goalCsslasses = `goal mb-6 ml-6 mr-6 ${
  //   isComplete ? "text-yellow-500" : "text-white"
  // }`;
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
    <View data-testid="goalTest">
      <TextInput
        editable={true}
        // contentEditable="true"
        // suppressContentEditableWarning={true}
        onChangeText={handleTitleChange}
        // className={testTitleCssClasses}>
        value={editableTitleValue}></TextInput>
      <View>
        <View>
          <Text>{goal.actualScore}</Text>
          <Text>/</Text>
          <Text>{goal.maxScore}</Text>
        </View>
        <View>
          <Button
            title="decrease score by 1"
            // className="mr-2 ml-2 group"
            onPress={handleDecrementScore}
            disabled={
              goal.actualScore === goal.minScore || isComplete
            }></Button>
          <Button
            title="increase score by 1"
            // className="group"
            onPress={handleIncrementScore}
            disabled={
              goal.actualScore === goal.maxScore || isComplete
            }></Button>
        </View>
        <View>
          <Button
            // className="deleteButton mr-4 group"
            title="delete goal"
            onPress={handleDeleteGoal}></Button>
          <Button
            title="reset goal"
            // className="resetButton group"
            disabled={goal.actualScore === 0}
            onPress={handleResetGoal}></Button>
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
