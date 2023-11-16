import { useState, SyntheticEvent } from "react";
import { FormProps, GoalType } from "../../types";
import { useAuthContext } from "../authProvider/AuthProvider";
import { TextInput, View, Text, StyleSheet, Pressable } from "react-native";
import { useMutation } from "@apollo/client";
import ADD_GOAL_MUTATION from "../../graphql/mutations/addGoalMutation";
import { USER_GOALS_QUERY } from "../../graphql/queries/userGoalsQuery";
import CREATE_GOAL_MUTATION from "../../graphql/mutations/addGoalMutation";

function GoalForm(props: FormProps) {
  const [goalTitle, setGoalTitle] = useState(
    props.titleToEdit ? props.titleToEdit : ""
  );
  const [goalMaxScore, setGoalMaxScore] = useState(
    props.maxScoreToEdit ? props.maxScoreToEdit : ""
  );
  const [useCreateGoalMutation] = useMutation(CREATE_GOAL_MUTATION, {
    refetchQueries: [USER_GOALS_QUERY],
    variables: {
      goalTitle: goalTitle,
      maxScore: parseInt(goalMaxScore),
    },
    onCompleted: (res) => {
      console.log({ res });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  async function handleCreateGoal() {
    await useCreateGoalMutation();
    props.onGoalFormSubmit();
  }

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Text>Goal title:</Text>
        <TextInput
          id="nameInput"
          value={goalTitle}
          onChangeText={(updatedText) => {
            console.log("Goal form -->   goal title input");
            setGoalTitle(updatedText);
          }}
        />
      </View>
      <View style={styles.input}>
        <Text>Times to meet per week:</Text>
        <TextInput
          id="scoreInput"
          value={goalMaxScore}
          onChangeText={(updatedText) => {
            console.log("Goal form --> score input  ");

            setGoalMaxScore(updatedText);
          }}
        />
      </View>
      <Pressable style={styles.height} onPress={handleCreateGoal}>
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
    marginTop: 45,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  height: {
    height: 40,
  },
});

export default GoalForm;
