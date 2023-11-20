import { useState, SyntheticEvent } from "react";
import { FormProps, GoalType, GoalsQueryResult } from "../../types";
import { useAuthContext } from "../authProvider/AuthProvider";
import { TextInput, View, Text, StyleSheet, Pressable } from "react-native";
import { useMutation } from "@apollo/client";
import ADD_GOAL_MUTATION from "../../graphql/mutations/addGoalMutation";
import CREATE_GOAL_MUTATION from "../../graphql/mutations/addGoalMutation";
import { USER_GOALS_QUERY } from "../../hooks/useGetGoals";

function GoalForm(props: FormProps) {
  const [goalTitle, setGoalTitle] = useState(
    props.titleToEdit ? props.titleToEdit : ""
  );
  const [goalMaxScore, setGoalMaxScore] = useState(
    props.maxScoreToEdit ? props.maxScoreToEdit : ""
  );
  const [useCreateGoalMutation] = useMutation(CREATE_GOAL_MUTATION, {
    variables: {
      goalTitle: goalTitle,
      maxScore: parseInt(goalMaxScore),
    },
    update(cache, { data }) {
      const newGoal: GoalType = data.createGoal;
      const allGoalsInCache = cache.readQuery<GoalsQueryResult>({
        query: USER_GOALS_QUERY,
      }).userGoals;
      console.log({ allGoalsInCache });
      console.log("printing newGoal as it goes in the new array...");
      console.log(newGoal);

      if (allGoalsInCache) {
        cache.writeQuery({
          query: USER_GOALS_QUERY,
          data: {
            userGoals: [...allGoalsInCache, newGoal],
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
