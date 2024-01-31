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
import { USER_GOALS_QUERY } from "../../graphql/operations/queries/getGoalsQuery";
import { useState, useRef, useCallback, useMemo } from "react";
import AddGoalButton from "../../components/addGoalButton/AddGoalButton";
import GoalForm from "../../components/goalForm/GoalForm";
import SignOutButton from "../../components/signOutButton/SignOutButton";
import { screenCommonStyles } from "../../style/screenCommonStyles";
import BottomSheet from "@gorhom/bottom-sheet";
import { gray } from "../../style/colors";
import { devModeLog } from "dev-mode-log";

function GoalsScreen() {
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("------------------------------------------------------------");
  devModeLog("GoalsScreen component rendered");
  devModeLog("GoalsScreen component --> retrieving auth context....");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const auth = useAuthContext();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    devModeLog("handleSheetChanges", index);
  }, []);

  const { loading, error, data } = useQuery(USER_GOALS_QUERY, {
    onCompleted: async (response) => {
      if (response && response.length) {
        devModeLog("goals fetched correctly");
        devModeLog("goals response is as follows");
        devModeLog({ response: response.userGoals.length });
      }
    },
  });

  devModeLog(
    "GoalsScreen component --> auth context retried in component is the following"
  );
  devModeLog({
    token: {
      state: auth.authTokensStateValues,
    },
  });
  devModeLog({ data });

  if (loading) {
    devModeLog("GoalsScreen --> loading goals for current logged user");
  } else if (error) {
    devModeLog("GoalsScreen --> there was an error while fetching goals");
    devModeLog({ error });
  } else {
    devModeLog(
      "GoalsScreen --> finished loading goals for current logged user"
    );
    devModeLog({ goals: data?.userGoals });
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
