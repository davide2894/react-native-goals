import { Alert, Button, View } from "react-native";
import { Modal } from "react-native";
import { useState } from "react";
import GoalForm from "../goalForm/GoalForm";

function NewGoalButton(
  {
    // prop: action to add new goals, received from goalscreen
  }
) {
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  function handlePress(evt) {
    console.log({ pressEvent: evt });
    setShowNewGoalForm(true);
  }

  return (
    <View>
      <Button onPress={handlePress} title="Add new goal"></Button>
      {showNewGoalForm && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showNewGoalForm}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setShowNewGoalForm(!showNewGoalForm);
          }}>
          <GoalForm
            mode="add"
            onGoalFormSubmit={() => setShowNewGoalForm(false)}
          />
        </Modal>
      )}
    </View>
  );
}

export default NewGoalButton;
