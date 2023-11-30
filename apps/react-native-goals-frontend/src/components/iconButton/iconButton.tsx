import { Text, StyleSheet, TouchableHighlight } from "react-native";

export default function IconButton(props: {
  onPressCallback: () => void;
  onHoverColor: string;
  iconComponent?: any;
  disabled?: any;
}) {
  return (
    <TouchableHighlight
      style={styles.button}
      onPress={props.onPressCallback}
      underlayColor={props.onHoverColor}>
      {/* {props.iconComponent} */}
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    width: "100%",
    height: 60,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginLeft: 8,
  },
});
