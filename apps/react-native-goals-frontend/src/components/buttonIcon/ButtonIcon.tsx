import {
  View,
  Pressable,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

function ButtonIcon(props: { iconName: string }) {
  //   const image = require(`./${props.iconName}.svg`);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: 40,
      height: 40,
    },
    image: {
      flex: 1,
      justifyContent: "center",
      width: 40,
      height: 40,
      // backgroundColor: "black",
      // backgroundImage: `url("./${props.iconName}.svg")`,
    },
    text: {
      //   color: "white",
      fontSize: 42,
      lineHeight: 84,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  // devModeLog(`PATH IS ============================ ./${props.iconName}.svg`);

  // <View style={styles.container}>
  //   <Pressable style={styles.container}>
  //     <ImageBackground
  //       //   source={{ uri: require(`./${props.iconName}.svg`) }}
  //       source={require("./adaptive-icon.png")}
  //       resizeMode="cover"
  //       style={styles.image}></ImageBackground>
  //     <Text style={styles.text}>+</Text>
  //   </Pressable>
  // </View>
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 30,
      }}>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          padding: 10,
          height: 30,
          width: "100%",
          flexDirection: "row",
        }}>
        {/* <Image src="" style={styles.image} /> */}
      </TouchableOpacity>
    </View>
  );
}

export default ButtonIcon;
