import React from "react";
import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import { QuickExit } from "../components/QuickExit";

export class Section extends React.Component {
  render() {
    return (
      <View style={styles.button}>
        <Ionicons name={this.props.icon} size={50} color={colors.tertiary} />
        <Text style={styles.text}>{this.props.description}</Text>
      </View>
    );
  }
}

function MainScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} />
      </View>
      <View style={styles.layout}>
        <Section icon="md-calendar" description="Calendar" />
        <Section icon="md-book" description="Journal" />
        <Section icon="ios-chatboxes" description="Check-In" />
        <Section icon="md-help-circle-outline" description="Support" />
      </View>
      <View>
        <QuickExit />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    height: "40%",
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    margin: 20,
    width: "40%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 15,
  },
});

export default MainScreen;
