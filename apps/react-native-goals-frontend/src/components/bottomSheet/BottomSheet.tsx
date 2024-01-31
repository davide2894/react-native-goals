import { ReactNode, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
} from "react-native";
import {
  black,
  caribbeanGreen,
  lightGray,
  outerSpace,
  white,
} from "../../style/colors";
import { devModeLog } from "dev-mode-log";

function BottomSheet(props: {
  children: ReactNode;
  translateY: Animated.Value;
  bottomSheetHeight: number;
}) {
  devModeLog({ bottomSheetHeight: props.bottomSheetHeight });

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          transform: [{ translateY: props.translateY }],
          height: props.bottomSheetHeight,
        },
      ]}>
      {props.children}
    </Animated.View>
  );
}

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 64,
    paddingLeft: 64,
    paddingRight: 64,
    paddingBottom: 0,
    elevation: 5,
    borderWidth: 1,
  },
  closeButton: {
    marginBottom: 50,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    alignSelf: "center",
    borderColor: lightGray,
    backgroundColor: caribbeanGreen,
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
    color: black,
  },
});
