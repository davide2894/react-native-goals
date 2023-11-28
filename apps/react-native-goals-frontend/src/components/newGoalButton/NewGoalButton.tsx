import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { useState } from "react";
import GoalForm from "../goalForm/GoalForm";
// import { caribbeanGreen } from "../../style/globals/color";

function NewGoalButton() {
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  function handlePress(evt) {
    console.log({ pressEvent: evt });
    setShowNewGoalForm(true);
  }

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={handlePress}>
        <Text style={styles.text}>Add</Text>
      </TouchableOpacity>

      {showNewGoalForm && (
        <Modal
          style={styles.modalContentWrapper}
          presentationStyle="pageSheet"
          animationType="slide"
          visible={showNewGoalForm}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setShowNewGoalForm(!showNewGoalForm);
          }}>
          {/* <GoalForm onGoalFormSubmit={() => setShowNewGoalForm(false)} /> */}
        </Modal>
      )}
    </View>
  );
}

export default NewGoalButton;

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    alignSelf: "center",
    borderColor: "lightgray",
    // backgroundColor: caribbeanGreen,
    borderWidth: 1,
    borderRadius: 10,
    width: "40%",
    height: 60,
    marginBottom: 60,
    padding: 15,
  },
  text: {
    display: "flex",
    textAlign: "center",
    color: "black",
  },
  modalContentWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    height: "80%",
    backgroundColor: "red",
  },
});
