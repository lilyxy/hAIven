import React from "react";
import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
        <MaterialCommunityIcons name={icon} size={65} color={colors.white} />
        <Text style={styles.text}>{description}</Text>
        {/* <Text style={styles.text}>{userid}</Text> */}
      </TouchableOpacity>
    </View>
  );
}

function MainScreen({route, navigation}) {
  const {username} = route.params
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} />
      </View>
      <View style={styles.layout}>
        <Section
          icon="calendar-multiselect"
          description="Calendar"
          screenName="Calendar"
          userid={username}
        />

        <Section
          icon="book-open-page-variant"
          description="Journal"
          screenName="Journal"
          userid={username}
        />

        <Section
          icon="android-messages"
          description="Check-In"
          screenName="ChatBot"
        />
        <Section icon="help-circle-outline" description="Support" />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <MaterialCommunityIcons
            style={{ alignSelf: "center", marginLeft: "2%" }}
            name="settings"
            size={50}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },
  header: {
    height: "35%",
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "center",
  },
});

export default MainScreen;