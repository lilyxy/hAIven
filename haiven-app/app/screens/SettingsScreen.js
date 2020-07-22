import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import colors from "../config/colors";
import { Footer } from "../components/Footer";

export class Input extends React.Component {
  render() {
    return (
      <View style={styles.input}>
        <Text>{this.props.input}</Text>
        <TextInput style={styles.textInput} />
      </View>
    );
  }
}

export class Setting extends React.Component {
  render() {
    return (
      <View>
        <View>
          <Text style={styles.subheading}>{this.props.subheading}</Text>
        </View>
        <View style={styles.information}>
          <Input input={this.props.input1} />
          <Input input={this.props.input2} />
        </View>
      </View>
    );
  }
}

export default function SettingsScreen() {
  return (
    <View style={styles.containter}>
      <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 40 }}>
        Settings
      </Text>
      <Setting
        subheading="Emergency Contact"
        input1="Name"
        input2="Phone Number"
      />
      <Setting subheading="Location" input1="City" input2="Address" />
      <Setting
        subheading="Passcode"
        input1="Calculator"
        input2="Emergency Contat"
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  containter: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  subheading: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    padding: 10,
  },
  information: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    padding: 5,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    alignSelf: "stretch",
    width: "60%",
    paddingHorizontal: 8,
  },
});
