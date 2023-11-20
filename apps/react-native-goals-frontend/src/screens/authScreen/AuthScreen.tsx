import React from "react";
import { View, StyleSheet } from "react-native";
import RegistrationForm from "../../components/registrationForm/RegistrationForm";
import LoginForm from "../../components/loginForm/LoginForm";

/**
 * TODO
 * [] if user is logged
 *  [] redirect to /goals screen
 * [] else show the auth content
 *  []login
 *    [] normal
 *    [] google
 *    [] continue as guest btn
 *   [] create new account btn
 *      [] add
 *      [] onclick
 *        [] set state to true
 *         [] show register normal form
 *         [] show regiter with google btn
 *         [] show back to login btn
 *         [] on click
 *           [] set state to false
 * [] click on register btn -> show
 */

function AuthScreen() {
  console.log("AuthScreen rendered");

  return (
    <>
      <View style={styles.container}>
        <RegistrationForm />
        <LoginForm />
      </View>
    </>
  );
}

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 10,
    height: "100%",
  },
});
