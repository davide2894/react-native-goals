import React, { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Button,
  Modal,
  Text,
} from "react-native";
import RegistrationForm from "../../components/registrationForm/RegistrationForm";
import LoginForm from "../../components/loginForm/LoginForm";
import GuestAccessButton from "../../components/guestAccessButton/GuestAccessButton";
import { formStyles } from "../../style/formCommonStyles";
import { caribbeanGreen } from "../../style/colors";
import CloseButton from "../../components/closeModalButton/CloseButton";

/**
 * TODO
 * [x] if user is logged
 *  [x] redirect to /goals screen
 * [] else show the auth content
 *  []login
 *    [x] normal
 *    [x] continue as guest btn
 *    [] google
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
  const [isRegistrationFormVisible, setIsRegistrationFormVisible] =
    useState(false);

  function showRegistrationForm() {
    setIsRegistrationFormVisible(true);
  }

  function onModalClosePress() {
    setIsRegistrationFormVisible(false);
  }

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 24,
          }}>
          Access control
        </Text>
        <StatusBar barStyle="dark-content" />
        <LoginForm />
        <View style={styles.registerSuggestion}>
          <Text>Don't have an account yet?</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={showRegistrationForm}
            style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <Modal
            visible={isRegistrationFormVisible}
            animationType="slide"
            presentationStyle="formSheet">
            <CloseButton onCloseButtonPress={onModalClosePress} />
            <RegistrationForm />
          </Modal>
        </View>
        <View style={styles.loginAlternatives}>
          <GuestAccessButton />
        </View>
      </View>
    </>
  );
}

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    margin: 16,
    marginTop: 100,
  },
  registerSuggestion: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "baseline",
    marginTop: 20,
    width: "100%",
  },
  registerButton: {
    marginRight: 15,
    marginLeft: 10,
  },
  registerButtonText: {
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: caribbeanGreen,
    color: caribbeanGreen,
    fontWeight: "800",
  },
  loginAlternatives: {
    marginTop: 36,
  },
});
