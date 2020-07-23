import React from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const BOT_USER = {
  _id: 2,
  name: "Sally",
  avatar: "https://i.imgur.com/7k12EPD.png",
};

class ChatBot extends React.Component {
  state = {
    messages: [
      {
        _id: 1,
        text: `Hey! I've noticed you've been feeling upset lately, how are you doing today?`,
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.sendBotResponse();
  }

  sendBotResponse() {
    let msg = {
      _id: this.state.messages.length + 1,
      text: "Do you want to talk about it?",
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState((currentState) => ({
      messages: GiftedChat.append(currentState.messages, [msg]),
    }));
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

export default ChatBot;
