import React from "react";
import ChatBot from "react-simple-chatbot";
import { View, Text, StyleSheet } from "react-native";
import { Footer } from "../components/Footer";
import { ThemeProvider } from "styled-components";
import colors from "../config/colors";

const steps = [
  {
    id: "0",
    message: "Hey, how is everything going today?",
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
      <ThemeProvider theme={theme}>
        <ChatBot steps={steps} hideHeader="true" />;
      </ThemeProvider>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: colors.primary,
    fontSize: 20,
    padding: 20,
    marginBottom: 15,
  },
});

// all available props
const theme = {
  background: "#fff",
  headerBgColor: colors.primary,
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: colors.primary,
  botFontColor: "#fff",
  userBubbleColor: colors.secondary,
  userFontColor: "#000",
};

export default ChatBotScreen;
