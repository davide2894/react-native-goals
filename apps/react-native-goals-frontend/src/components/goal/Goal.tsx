import React, { Fragment, useEffect, useState } from "react";
import { GoalType } from "../../types";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import GoalForm from "../goalForm/GoalForm";
import trimString from "../../utils/trimString";
import useIncrementScore from "../../hooks/useIncrementScore";
import useDecrementScore from "../../hooks/useDecrementScore";
import useDeleteGoal from "../../hooks/useDeleteGoal";
import useResetScore from "../../hooks/useResetScore";
function Goal(props: { goal: GoalType }) {
  const goal = props.goal;
  const [showEditGoalForm, setShowEditGoalForm] = useState(false);
  const [editableTitleValue, setEditableTitleValue] = useState(goal.title);
  const isComplete = goal.actualScore === goal.maxScore;
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

  // function handleEditGoalTitle() {
  //   useIncrementScore(goal)
  // }

  function handleIncrementScore() {
    useIncrementScore(goal);
  }

  function handleDecrementScore() {
    useDecrementScore(goal);
  }

  function handleDeleteGoal() {
    useDeleteGoal(goal);
  }

  function handleResetGoal() {
    useResetScore(goal);
  }

  // useEffect(() => {
  //   dispatch(updateGoalTitle({ id: goal.id, editableTitleValue }));
  //   return () => {};
  // }, [editableTitleValue, dispatch, goal.id]);

  return (
    <View data-testid="goalTest">
      <TextInput
        // contentEditable="true"
        // suppressContentEditableWarning={true}
        onChangeText={handleTitleChange}
        // className={testTitleCssClasses}>
        value={goal.title}></TextInput>
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
            title="edit goal"
            // className="editButton mr-4 group"
            disabled={isComplete}
            onPress={onEditFormOpenHandler}></Button>
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
