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
    marginTop: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
  },
});
