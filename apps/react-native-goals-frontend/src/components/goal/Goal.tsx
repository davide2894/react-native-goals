import React from "react";
import { GoalType } from "../../types";
import { Text, View } from "react-native";
function Goal(props: { data: GoalType }) {
  return (
    <>
      <View>
        <Text>{props.data.title}</Text>
        <Text>{props.data.id}</Text>
        <Text>{props.data.maxScore}</Text>
        <Text>{props.data.minScore}</Text>
        <Text>{props.data.timestamp}</Text>
        <Text>{props.data.userIdRef}</Text>
      </View>
    </>
  );
}

export default Goal;
