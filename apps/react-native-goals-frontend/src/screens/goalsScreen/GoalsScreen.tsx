import {
  StyleSheet,
  Animated,
  FlatList,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import { ServerError, useApolloClient, useQuery } from "@apollo/client";
import { USER_GOALS_QUERY } from "../../graphql/operations/mutations/getGoalsQuery";
import { useState, useRef } from "react";
import AddGoalButton from "../../../addGoalButton/AddGoalButton";
import CloseButton from "../../components/closeModalButton/CloseButton";
import GoalForm from "../../components/goalForm/GoalForm";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { screenCommonStyles } from "../../style/screenCommonStyles";
import BottomSheet from "../../components/bottomSheet/BottomSheet";
import { deleteAccessTokenFromStorage } from "../../utils/accessToken";
import apolloClient from "../../utils/apolloClient";

const bottomSheetHeight = 400;

function GoalsScreen({ navigation }) {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("GoalsScreen component rendered");
  console.log("GoalsScreen component --> retrieving auth context....");
  const [isVisible, setIsVisible] = useState(false);
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const auth = useAuthContext();
  const apolloClient = useApolloClient();

  const { loading, error, data } = useQuery(USER_GOALS_QUERY, {
    onCompleted: async (response) => {
      if (response && response.length) {
        console.log("goals fetched correctly");
        console.log("goals response is as follows");
        console.log({ response: response.userGoals.length });
      }
    },
    onError: async (error) => {
      console.log(error);
    },
  });

  console.log(
    "GoalsScreen component --> auth context retried in component is the following"
  );
  console.log({
    token: {
      state: auth.accessTokenStateValue,
    },
  });
  console.log({ data });

  if (loading) {
    console.log("GoalsScreen --> loading goals for current logged user");
  } else if (error) {
    console.log("GoalsScreen --> there was an error while fetching goals");
    console.log({ error });
  } else {
    console.log(
      "GoalsScreen --> finished loading goals for current logged user"
    );
    console.log({ goals: data?.userGoals });
  }

  function handleRenderItem({ item, ..._ }) {
    return <Goal key={item.id} goal={item} />;
  }

  function openBottomSheet() {
    console.log("---------------------");
    console.log("openBottomSheet");
    console.log({ translateY });
    console.log({ height });
    setIsVisible(true);
    Animated.timing(translateY, {
      toValue: height - bottomSheetHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeBottomSheet() {
    console.log("---------------------");
    console.log("closeBottomSheet");
    console.log({ translateY });
    console.log({ height });
    console.log({ heightAfterAnimation: height });

    Animated.timing(translateY, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  }

  function onKeyboardShow(event) {
    const keyboardHeight = event.endCoordinates.height;
    console.log("---------------------");
    console.log("onKeyboardDidShow");
    console.log({ keyboardHeight });
    console.log({ height });
    console.log({ translateY });
    console.log({
      heightAfterAnimation: height - keyboardHeight - bottomSheetHeight,
    });
    Animated.timing(translateY, {
      toValue: height - keyboardHeight - bottomSheetHeight,
      useNativeDriver: true,
    }).start();
  }

  function onKeyboardHide() {
    console.log("---------------------");
    console.log("onKeyboardDidShow ");
    console.log({ height });
    console.log({ translateY });
    console.log({ heightAfterAnimation: height });

    Animated.timing(translateY, {
      toValue: height - bottomSheetHeight,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={{ maxHeight: height, position: "relative" }}>
      <View style={{ ...styles.container, ...screenCommonStyles.layout }}>
        <View style={styles.header}>
          <Text style={styles.h1}>Goals</Text>
          <SignOutButton />
        </View>
        {!loading && !error && (
          <>
            <FlatList
              data={data.userGoals}
              keyExtractor={(item) => item.id.toString()}
              renderItem={handleRenderItem}></FlatList>
            <AddGoalButton onPressCallback={openBottomSheet} />
          </>
        )}
        {isVisible && (
          <BottomSheet
            translateY={translateY}
            bottomSheetHeight={bottomSheetHeight}>
            <CloseButton
              onCloseButtonPress={closeBottomSheet}
              a11yText={"Close form and bottom sheet"}
            />
            <GoalForm
              onKeyboardShow={onKeyboardShow}
              onKeyboardHide={onKeyboardHide}
              closeBottomSheet={closeBottomSheet}
            />
          </BottomSheet>
        )}
      </View>
    </View>
  );
}

export default GoalsScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  h1: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginBottom: 30,
    fontSize: 30,
  },
});
