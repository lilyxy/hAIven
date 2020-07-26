import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";

export class QuickExit extends React.Component {
  render() {
    return (
      <View style={styles.circle}>
        <FontAwesome name="exclamation" size={50} color="white" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").width * 0.2,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: colors.tertiary,
  },
});
