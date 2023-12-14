import {
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  TouchableHighlight,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { caribbeanGreen } from "../../style/colors";

const CloseButton = (props: {
  onCloseButtonPress?: () => void;
  a11yText?: string;
}) => {
  return (
    <TouchableHighlight
      accessibilityLabel={props.a11yText}
      style={styles.button}
      underlayColor={caribbeanGreen}
      onPress={props.onCloseButtonPress}>
      <AntDesign name="close" size={24} color="black" />
    </TouchableHighlight>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 0,
    right: 16,
    padding: 10,
    borderRadius: 100,
    borderWidth: 2,
  },
});
