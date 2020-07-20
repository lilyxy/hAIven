import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Picker,
} from "react-native";
import colors from "../config/colors";
import { Footer } from "../components/Footer";
import { Ionicons } from "@expo/vector-icons";

export class Journal extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.subheading}>Journal</Text>
        <TextInput
          style={styles.entry}
          multiline
          placeholder="How was your day?"
          placeholderTextColor="#000"
          // Implement this when we have a database connected.
          // When text is changed we can save to database.
          // onChangeText={(text) => someFunction(text)}
        />
      </View>
    );
  }
}

export class Mood extends React.Component {
  render() {
    return (
      <View style={{ alignItems: "center", marginRight: 50 }}>
        <Text style={styles.subheading}>{this.props.subheading}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[styles.circle, { backgroundColor: this.props.bgcolor }]}
          ></View>

          <Text
            style={{
              backgroundColor: colors.grey,
              borderRadius: 10,
              padding: 5,
            }}
          >
            {this.props.mood}
          </Text>
        </View>
        <View style={{ fontStyle: "italic" }}>
          <Text>{this.props.time}</Text>
          <Text>{this.props.length}</Text>
        </View>
      </View>
    );
  }
}

function JournalScreen({ route }) {
  const { date } = route.params;
  const [selectedValue, setSelectedValue] = React.useState("");
  const moodColor = !selectedValue ? colors.grey : colors[selectedValue];
  return (
    <View style={styles.container}>
      {/* <View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <FontAwesome name="chevron-left" size={24} color={colors.primary} />
          <FontAwesome name="chevron-right" size={24} color={colors.primary} />
        </View>
      </View> */}
      <View>
        <Text style={styles.dateHeading}>{date}</Text>
      </View>
      <View style={[styles.container, styles.layout]}>
        <View>
          <Mood subheading="My Mood" bgcolor={moodColor} mood={selectedValue} />
          <View>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              prompt="Mood?"
            >
              <Picker.Item label="sad" value="sad" />
              <Picker.Item label="happy" value="happy" />
              <Picker.Item label="angry" value="angry" />
            </Picker>
          </View>
        </View>
        <Mood
          subheading="Audio (1)"
          bgcolor={colors.angry}
          mood="Angry"
          time="9:48PM"
          length="3 minutes"
        />
      </View>
      <View>
        <Ionicons
          style={styles.notification}
          name="ios-chatbubbles"
          size={40}
          color="#8FBC8F"
        />
        <Journal style={{ alignSelf: "stretch" }} />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  mood: {
    flexDirection: "row",
  },
  notification: {
    position: "absolute",
    alignSelf: "flex-end",
    padding: 10,
    zIndex: 1,
  },
  dateHeading: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
    margin: 15,
  },
  entry: {
    backgroundColor: colors.secondary,
    minHeight: Dimensions.get("window").height * 0.3,
    borderRadius: 10,
    padding: 10,
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
    alignSelf: "flex-start",
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
