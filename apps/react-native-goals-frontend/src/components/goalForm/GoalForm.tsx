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
import CREATE_GOAL_MUTATION from "../../graphql/operations/mutations/addGoalMutation";
import { formStyles } from "../../style/formCommonStyles";
import { lightGray } from "../../style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { USER_GOALS_QUERY } from "../../graphql/operations/queries/getGoalsQuery";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { devModeLog } from "dev-mode-log";

function GoalForm(props: {
  onKeyboardShow?: (evt: any) => void;
  onKeyboardHide?: () => void;
  closeBottomSheet?: () => void;
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
      devModeLog({ allGoalsInCache });
      devModeLog("printing newGoal as it goes in the new array...");
      devModeLog(newGoal);

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
      devModeLog({ res });
    },
    onError: (error) => {
      devModeLog({ error });
    },
  });

  async function handleCreateGoal() {
    props.closeBottomSheet();
    await useCreateGoalMutation();
  }

  return (
    <View style={formStyles.container}>
      <KeyboardAvoidingView behavior={isIosRef ? "padding" : "height"}>
        <BottomSheetTextInput
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
        <BottomSheetTextInput
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
