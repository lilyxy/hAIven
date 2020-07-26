import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import colors from "../config/colors";
import { Footer } from "../components/Footer";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from 'axios';

export class Insight extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      calender_input: ''
    }
  }
  render() {
    return (
      <View style={styles.insight}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>
            {this.props.insight}
          </Text>
          <FontAwesome5 name={this.props.icon} size={24} color="black" />
        </View>
        <Text>{this.props.text}</Text>
      </View>
    );
  }
}

function CalendarScreen({ navigation, route }) {
  const { username } = route.params
  const [calenderInput, setCalenderInput] = useState();
  useEffect(() => {
    axios.post('http://127.0.0.1:5000/calender', {
      username: 'elainelau'
    })
    .then(({data}) => {
      setCalenderInput(data);
    });    
  }, []);
  console.log(calenderInput)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View>
        <Calendar
          onDayPress={(day) => {
            var dateSelected = new Date(
              day["year"],
              day["month"] - 1,
              day["day"]
            );
            navigation.navigate("Journal", {
              date: dateSelected.toDateString(),
              username: username
            });
          }}
          theme={{
            textSectionTitleColor: colors.primary,
            monthTextColor: colors.primary,
            indicatorColor: "blue",
            selectedDotColor: colors.secondary,
            selectedDayTextColor: colors.secondary,
            todayTextColor: colors.primary,
            arrowColor: colors.primary,
            textMonthFontWeight: "bold",
            textMonthFontSize: 30,
          }}
          m // Collection of dates that have to be colored in a special way. Default = {}
          markedDates={
            calenderInput
            // "2020-07-19": {disabled: true, startingDay: true, color: colors.sad, endingDay: true},
            // "2020-07-20": {disabled: true, startingDay: true, color: colors.sad, endingDay: true,},
            // "2020-07-21": {disabled: true,startingDay: true,color: colors.happy, endingDay: true,},
          }
          // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
          markingType={"period"}
          />
          </View>
          <View
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 5,
            width: "50%",
            marginTop: 10,
            alignSelf: "center",
          }}
        />
        <View style={{ padding: 10 }}>
          <Text style={styles.subheading}>Insights</Text>
          <Insight
            insight="Happiness"
            icon="smile-beam"
            text="This month you were on average happier than last month."
          />
          <Insight
            insight="Anger"
            icon="sad-tear"
            text="We've noticd that there is usally anger detected Saturday nights."
          />
        </View>
      </ScrollView>
      <View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  insight: {
    margin: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
  },
  subheading: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 25,
  },
});

export default CalendarScreen;
