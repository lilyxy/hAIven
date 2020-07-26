import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

export class Container extends React.Component {
  render() {
    return <View style={styles.container}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 10,
  },
});
