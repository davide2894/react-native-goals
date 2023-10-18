import React from "react";
import { View, Text } from "react-native";
import RegistrationForm from "../../components/registrationForm/RegistrationForm";

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
  return (
    <>
      <View>
        <RegistrationForm/>
      </View>
    </>
  );
}

export default AuthScreen;
