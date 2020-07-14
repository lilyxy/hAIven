import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import colors from "../config/colors";

function CalendarScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Calendar
          style={{
            alignSelf: "stretch",
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
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default CalendarScreen;
