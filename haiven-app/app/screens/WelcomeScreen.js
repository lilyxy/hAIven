import React from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Button,
  TextInput,
} from "react-native";

import colors from "../config/colors";

function WelcomeScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <Image source={require("../assets/logo.png")} />
      </View>
      <View style={styles.logIn}>
        <TextInput
          style={styles.input}
          placeholder="   username"
          placeholderTextColor="#000"
        />
        <TextInput
          style={styles.input}
          placeholder="   password"
          placeholderTextColor="#000"
        />
        <View style={styles.logInButton}>
          <Button title="Log In" color="#A983B3" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: "70%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginHorizontal: 25,
    marginVertical: 10,
    height: 40,
    backgroundColor: colors.secondary,
    alignSelf: "stretch",
    borderRadius: 10,
  },
  logIn: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logInButton: {
    alignSelf: "flex-end",
    paddingRight: 20,
    borderRadius: 10,
  },
});

export default WelcomeScreen;
