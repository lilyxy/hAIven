import React from "react";
import ChatBot from "react-simple-chatbot";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import { Footer } from "../components/Footer";
import { ThemeProvider } from "styled-components";
import colors from "../config/colors";

const steps = [
  {
    id: "0",
    message: "Hey, how are you doing today?",
    trigger: "1",
  },
  {
    id: "1",
    user: true,
    trigger: "2",
  },
  {
    id: "2",
    message: "Do you want to talk about it?",
    end: true,
  },
];

function ChatBotScreen(props) {
  return (
    <View style={{ justifyContent: "space-between", flex: 1 }}>
      <Text style={styles.header}>Check In</Text>
      <View style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
        <ThemeProvider theme={theme}>
          <ChatBot steps={steps} hideHeader="true" />;
        </ThemeProvider>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    color: "#fff",
    height: "10%",
    backgroundColor: colors.primary,
    fontSize: 30,
    padding: 20,
    marginBottom: 15,
  },
});

// all available props
const theme = {
  background: "#fff",
  fontFamily: "Roboto",
  headerBgColor: colors.primary,
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: colors.primary,
  botFontColor: "#fff",
  userBubbleColor: colors.secondary,
  userFontColor: "#000",
};

export default ChatBotScreen;
