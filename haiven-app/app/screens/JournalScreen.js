import React from "react";
import { StyleSheet, View, TextInput, Text, Dimensions } from "react-native";
import colors from "../config/colors";

export class Journal extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.subheading}>Journal</Text>
        <TextInput
          style={styles.entry}
          placeholder="   How was your day?"
          placeholderTextColor="#000"
        />
      </View>
    );
  }
}

export class Date extends React.Component {
  render() {
    let date = new Date();
    return <View>{date}</View>;
  }
}

export class Mood extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.subheading}>{this.props.subheading}</Text>
        <View
          style={[styles.circle, { backgroundColor: this.props.bgcolor }]}
        ></View>
        <Text style={{ fontWeight: "bold" }}>{this.props.mood}</Text>
        <Text>{this.props.time}</Text>
        <Text>{this.props.length}</Text>
      </View>
    );
  }
}

function JournalScreen(props) {
  return (
    <View>
      <View style={[styles.container, styles.layout]}>
        <Mood subheading="My Mood" bgcolor={colors.sad} mood="Sad" />
        <Mood
          subheading="Audio (1)"
          bgcolor={colors.angry}
          mood="Angry"
          time="9:48PM"
          length="3 minutes"
        />
      </View>
      <View style={{ alignItems: "stretch" }}>
        <Journal />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  entry: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  subheading: {
    color: colors.primary,
    fontWeight: "bold",
    margin: 10,
  },
  layout: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "baseline",
  },
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

export default JournalScreen;
