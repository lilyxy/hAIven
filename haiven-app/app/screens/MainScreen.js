import React from "react";
import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import { Footer } from "../components/Footer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

export function Section({ screenName, icon, description, userid}) {
  var today = new Date().toDateString();
  const navigation = useNavigation();
  return (
    <View style={styles.button}>
      <TouchableOpacity
        onPress={() => navigation.navigate(screenName, { date: today, username: userid})}
      >
        <Ionicons name={icon} size={60} color={colors.white} />
        <Text style={styles.text}>{description}</Text>
        {/* <Text style={styles.text}>{userid}</Text> */}
      </TouchableOpacity>
    </View>
  );
}

function MainScreen({route}) {
  const {username} = route.params
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} />
      </View>
      <View style={styles.layout}>
        <Section
          icon="md-calendar"
          description="Calendar"
          screenName="Calendar"
          userid={username}
        />

        <Section icon="md-book" description="Journal" screenName="Journal" userid={username} />

        <Section
          icon="ios-chatboxes"
          description="Check-In"
          screenName="ChatBot"
        />

        <Section icon="md-help-circle-outline" description="Support" />
      </View>
      <View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    padding: 10,
    borderRadius: 10,
    margin: 15,
    width: "40%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default MainScreen;