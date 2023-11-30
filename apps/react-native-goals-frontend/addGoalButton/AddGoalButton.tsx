import { StyleSheet, TouchableHighlight } from "react-native";
import { lightGray, caribbeanGreen, outerSpace } from "../src/style/colors";
import { Entypo } from "@expo/vector-icons";

const AddGoalButton = (props: { onPressCallback: () => void }) => {
  return (
    <TouchableHighlight
      style={styles.button}
      accessibilityLabel="Add a new goal to your list"
      onPress={props.onPressCallback}
      underlayColor={caribbeanGreen}>
      <Entypo name="new-message" size={48} color={outerSpace} />
    </TouchableHighlight>
  );
};

export default AddGoalButton;

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 24,
    width: 72,
    height: 72,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: lightGray,
  },
});
