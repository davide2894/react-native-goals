import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableHighlight,
  Animated,
  useWindowDimensions,
} from "react-native";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import NewGoalButton from "../../components/newGoalButton/NewGoalButton";
import useGetGoals from "../../hooks/useGetGoals";
import { useApolloClient } from "@apollo/client";
import BottomSheet from "../../components/bottomSheet/BottomSheet";
import GoalForm from "../../components/goalForm/GoalForm";
import {
  caribbeanGreen,
  lightGray,
  outerSpace,
  white,
} from "../../style/colors";
import { screenCommonStyles } from "../../style/screenCommonStyles";
import { useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import CloseButton from "../../components/closeModalButton/CloseButton";

function GoalsScreen() {
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
  const { loading, error, data } = useGetGoals();
  const client = useApolloClient();
  const bottomSheetHeight = 400;

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
    // console.log({ currentRenderItem: item });
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
    <View>
      <View style={{ ...styles.container, ...screenCommonStyles.layout }}>
        <View style={styles.header}>
          <Text style={styles.h1}>Goals</Text>
          <SignOutButton />
        </View>
        {!loading && !error && (
          <FlatList
            data={data.userGoals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={handleRenderItem}></FlatList>
        )}
        {/* {!loading && !error && <NewGoalButton />} */}
        <View>
          <TouchableHighlight
            style={{
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
            }}
            accessibilityLabel="Add a new goal to your list"
            onPress={openBottomSheet}
            underlayColor={caribbeanGreen}>
            <Entypo name="new-message" size={48} color={outerSpace} />
          </TouchableHighlight>
        </View>
      </View>
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
