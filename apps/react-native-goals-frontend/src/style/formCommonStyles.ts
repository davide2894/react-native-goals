import { StyleSheet } from "react-native";
import { caribbeanGreen, lightGray } from "./colors";

export const formStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  input: {
    height: 70,
    borderWidth: 1,
    borderColor: lightGray,
    color: "gray",
    borderRadius: 10,
    marginBottom: 12,
    padding: 25,
  },
  submitButton: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    backgroundColor: caribbeanGreen,
    marginTop: 20,
  },
  submitText: {
    display: "flex",
    textAlign: "center",
    color: "black",
  },
});
