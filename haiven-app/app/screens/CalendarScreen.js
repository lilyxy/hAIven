import React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import colors from "../config/colors";
import { Footer } from "../components/Footer";
import { FontAwesome5 } from "@expo/vector-icons";

export class Insight extends React.Component {
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

function CalendarScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Calendar
          onDayPress={(day) => {
            navigation.navigate("Journal", { date: day });
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
        />
      </View>
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
    margin: 15,
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
