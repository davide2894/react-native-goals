import { useEffect, useRef, useState } from "react";
import { FormProps, GoalType, GoalsQueryResult } from "../../types";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation } from "@apollo/client";
import CREATE_GOAL_MUTATION from "../../graphql/mutations/addGoalMutation";
import { formStyles } from "../../style/formCommonStyles";
import { lightGray } from "../../style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { USER_GOALS_QUERY } from "../../graphql/operations/mutations/getGoalsQuery";

function GoalForm(props: {
  onKeyboardShow: (evt: any) => void;
  onKeyboardHide: () => void;
  closeBottomSheet: () => void;
}) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalMaxScore, setGoalMaxScore] = useState("");
  const isIosRef = useRef(Platform.OS === "ios");
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
    props.closeBottomSheet();
    await useCreateGoalMutation();
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      `${isIosRef ? "keyboardWillShow" : "keyboardDidShow"}`,
      props.onKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      `${isIosRef ? "keyboardWillHide" : "keyboardDidHide"}`,
      props.onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={formStyles.container}>
      <KeyboardAvoidingView behavior={isIosRef ? "padding" : "height"}>
        <TextInput
          id="nameInput"
          // autoFocus={true}
          style={formStyles.input}
          placeholder="Goal name or title"
          placeholderTextColor={lightGray}
          value={goalTitle}
          onChangeText={(updatedText) => {
            setGoalTitle(updatedText);
          }}
        />
        <TextInput
          style={formStyles.input}
          id="scoreInput"
          placeholder="Times per week"
          placeholderTextColor={lightGray}
          value={goalMaxScore}
          onChangeText={(updatedText) => {
            setGoalMaxScore(updatedText);
          }}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={formStyles.submitButton}
          onPress={handleCreateGoal}>
          <Text style={formStyles.submitText}>Add new goal</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

export default GoalForm;
