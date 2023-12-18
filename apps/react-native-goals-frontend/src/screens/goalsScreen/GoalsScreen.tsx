import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthContext } from "../../components/authProvider/AuthProvider";
import Goal from "../../components/goal/Goal";
import { useQuery } from "@apollo/client";
import { USER_GOALS_QUERY } from "../../graphql/operations/mutations/getGoalsQuery";
import { useState, useRef, useCallback, useMemo } from "react";
import AddGoalButton from "../../components/addGoalButton/AddGoalButton";
import GoalForm from "../../components/goalForm/GoalForm";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { screenCommonStyles } from "../../style/screenCommonStyles";
import BottomSheet from "@gorhom/bottom-sheet";
import { caribbeanGreen, gray } from "../../style/colors";

function GoalsScreen() {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("GoalsScreen component rendered");
  console.log("GoalsScreen component --> retrieving auth context....");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const auth = useAuthContext();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const { loading, error, data } = useQuery(USER_GOALS_QUERY, {
    onCompleted: async (response) => {
      if (response && response.length) {
        console.log("goals fetched correctly");
        console.log("goals response is as follows");
        console.log({ response: response.userGoals.length });
      }
    },
  });

  console.log(
    "GoalsScreen component --> auth context retried in component is the following"
  );
  console.log({
    token: {
      state: auth.authTokensStateValues,
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

  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.contentContainer, ...screenCommonStyles.layout }}>
        <View style={styles.header}>
          <Text style={styles.h1}>Goals</Text>
          <SignOutButton />
        </View>
        {loading && <ActivityIndicator size="large" color={gray} />}
        {!loading && !error && (
          <>
            <FlatList
              data={data.userGoals}
              keyExtractor={(item) => item.id.toString()}
              renderItem={handleRenderItem}></FlatList>
          </>
        )}
        <AddGoalButton onPressCallback={() => setIsBottomSheetVisible(true)} />
        {isBottomSheetVisible && (
          <BottomSheet
            style={styles.bottomSheet}
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            onClose={() => setIsBottomSheetVisible(false)}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                position: "relative",
                padding: 10,
              }}>
              <GoalForm
                closeBottomSheet={() => setIsBottomSheetVisible(false)}
              />
            </View>
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
    borderWidth: 2,
    height: "100%",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    paddingBottom: 60,
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
  bottomSheet: {
    padding: 10,
    position: "relative",
  },
});
