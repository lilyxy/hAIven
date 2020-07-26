import React from "react";
import { Entypo } from "@expo/vector-icons";
import colors from "../config/colors";
import { StyleSheet, View } from "react-native";

export class BackButton extends React.Component {
  render() {
    return (
      <View style={styles.back}>
        <Entypo name="arrow-bold-left" size={50} color={colors.primary} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  back: {
    alignSelf: "flex-start",
  },
});
