import React from "react";
import { StyleSheet, View, SafeAreaView, Text, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";

export class Feature extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: ''
    }
  }
  render() {
    return (
      <View style={styles.feature}>
        <View style={styles.text}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text>{this.props.description}</Text>
        </View>
        <View
          style={[styles.circle, { backgroundColor: this.props.circleColor }]}
        >
          <FontAwesome name={this.props.icon} size={50} color="white" />
        </View>
      </View>
    );
  }
}

function FeatureScreen({ navigation, props, route }) {
  const {username} = route.params
  return (
    <SafeAreaView style={styles.container}>
      <Feature
        icon="lock"
        title="Safe and Secure"
        description="All audio recordings are securely stored outside of your phone. All features are hidden behind the calculator app to ensure private access"
        circleColor={colors.primary}
      />
      <Feature
        icon="phone"
        title="Emergency Option"
        description="You can set up an “Emergency Contact” option under settings. This contact can be notified based on a predefined codeword."
        circleColor={colors.primary}
      />
      <Feature
        icon="bell-slash-o"
        title="No Notifications"
        description="haiven will not send any notifications to your phone and will not download any automatic updates."
        circleColor={colors.primary}
      />
      <Feature
        icon="exclamation"
        title="Quick Exit"
        description="The Quick Exit button can be found on every page. Pressing this will automatically close the app and remove the app from “Recently Used Apps”"
        circleColor={colors.tertiary}
      />

      <View style={styles.nextButton}>
        <Button
          title="Next"
          color={colors.primary}
          onPress={() => {
            navigation.navigate("Main", {
              username: username
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default FeatureScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  feature: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
    height: "100%",
    margin: 10,
    flex: 1,
  },
  text: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 6,
    paddingLeft: 35,
    width: "80%",
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "flex-start",
  },
  title: {
    color: colors.primary,
    fontWeight: "bold",
  },
  nextButton: {
    alignSelf: "flex-end",
    margin: 15,
  },
});