import React from "react";
import { View, StyleSheet } from "react-native";
// import { BackButton } from "./BackButton";
import { QuickExit } from "./QuickExit";

export class Footer extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <BackButton /> */}
        <QuickExit />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: "8%",
    marginRight: "2%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center", //Here is the trick
    bottom: 0, //Here is the trick
  },
});
