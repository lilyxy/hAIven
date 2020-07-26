import React from "react";
import axios from "axios";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Button,
  TextInput,
} from "react-native";

import colors from "../config/colors";
class WelcomeScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      arr: []
    }
  }
  handleUsername = (text) => {
    this.setState({ username: text });
    console.log(text);
  };
  handlePassword = (text) => {
    this.setState({ password: text });
  };

  handleLogin = () => {
    axios.post('http://127.0.0.1:5000/home', {
      username: this.state.username,
      password: this.state.password
    })
    .then(response => {
      if (response.data == "Does not exist"){
        this.props.navigation.navigate("Welcome");
      } else if (response.data == "Wrong password") {
        this.props.navigation.navigate("Welcome");
      } else {
        console.log(this.state.username)
        this.props.navigation.navigate("Feature", {
          username: this.state.username,
        });
      }
    }).catch(error => {console.log(error)});    
  }
  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.background}>
          <Image source={require("../assets/logo.png")} />
        </View>
        <View style={styles.logIn}>
          <TextInput
            style={styles.input}
            placeholder="username"
            placeholderTextColor="#000"
            onChangeText={this.handleUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor="#000"
            onChangeText={this.handlePassword}
            secureTextEntry
          />
          <View style={styles.logInButton}>
            <Button
              title="Log In"
              color={colors.primary}
              onPress={this.handleLogin}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
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
    padding: 10,
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
  },
});

export default WelcomeScreen;
