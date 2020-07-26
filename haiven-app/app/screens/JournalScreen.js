import React from "react";
import axios from 'axios';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Picker,
  Button,
} from "react-native";
import colors from "../config/colors";
import { Footer } from "../components/Footer";
import { Ionicons } from "@expo/vector-icons";

// Journal entry component
export class Journal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      journalContent: '',
      journalMood: '',
      date: ''
    }
  }
  render() {
    return (
      <View>
        <TextInput
          style={styles.entry}
          multiline
          placeholder="Tell me about your day."
          placeholderTextColor="#000"
          // Implement this when we have a database connected.
          // When text is changed we can save to database.
          onChangeText={this.props.onJournalChange}
        />
      </View>
    );
  }
}

// Mood component
export class Mood extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.subheading}>{this.props.subheading}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[styles.circle, { backgroundColor: this.props.bgcolor }]}
          ></View>
          <Text
            style={{
              borderRadius: 10,
              padding: 5,
              backgroundColor: this.props.textBackground,
            }}
          >
            {this.props.mood}
          </Text>
        </View>
        <View>
          <Text>{this.props.time}</Text>
          <Text>{this.props.length}</Text>
        </View>
      </View>
    );
  }
}

function JournalScreen({ route }) {
  const { username } = route.params
  const { date } = route.params;
  const [selectedValue, setSelectedValue] = React.useState("")
  const [journalContent, setJournalContent] = React.useState("")
  const moodColor = !selectedValue ? colors.white : colors[selectedValue];
  const textBackground = !selectedValue ? colors.white : colors.secondary;

  const handleJournal = () => {
    axios.post('http://127.0.0.1:5000/journal', {
      username: username, 
      journalContent: journalContent, 
      journalMood: selectedValue,
      date: date
    })
    .then(response=>{
      console.log(response)
    }).catch(error => {console.log(error)});    
  }
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
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.primary,
          overflow: "hidden",
          width: "50%",
        }}
      >
        <Picker
          style={{
            backgroundColor: colors.secondary,
            padding: 0,
          }}
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
          prompt="How are you feeling today?"
        >
          <Picker.Item label="Click to Select a Mood" value="" />
          <Picker.Item label="Sad" value="sad" />
          <Picker.Item label="Happy" value="happy" />
          <Picker.Item label="Angry" value="angry" />
        </Picker>
      </View>
      <View style={styles.layout}>
        <View style={styles.moodContainer}>
          <Mood
            subheading="My Mood"
            bgcolor={moodColor}
            mood={selectedValue}
            textBackground={textBackground}
          />
        </View>

        <View style={styles.moodContainer}>
          <Mood
            subheading="Audio (1)"
            bgcolor={colors.angry}
            mood="Angry"
            time="9:48PM"
            length="3 minutes"
          />
        </View>
      </View>
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("ChatBot");
          }}
        >
          <Ionicons
            style={styles.notification}
            name="ios-notifications"
            size={40}
            color={colors.black}
          />
        </TouchableWithoutFeedback>
        <Journal 
          style={{ alignSelf: "stretch" }} 
          onJournalChange={text => setJournalContent(text)}
        />
        <Button onClick={handleJournal} color={colors.primary} title="Submit"/>
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
  moodContainer: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 10,
    width: "45%",
    padding: 10,
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
    fontSize: 20,
    padding: 10,
  },
  entry: {
    backgroundColor: colors.secondary,
    minHeight: Dimensions.get("window").height * 0.2,
    borderRadius: 10,
    padding: 10,
  },
  subheading: {
    color: colors.primary,
    fontWeight: "bold",
  },
  layout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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