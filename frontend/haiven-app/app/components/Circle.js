import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

export class Circle extends React.Component {
  render() {
    return <View style={styles.circle}></View>;
  }
}
const styles = StyleSheet.create({
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    width: Dimensions.get("window").width * 0.08,
    height: Dimensions.get("window").width * 0.08,
    margin: 5,
  },
});
