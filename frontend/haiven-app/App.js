import React, { useEffect } from "react";

import CalculatorScreen from "./app/screens/CalculatorScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import FeatureScreen from "./app/screens/FeatureScreen";
import MainScreen from "./app/screens/MainScreen";
import CalendarScreen from "./app/screens/CalendarScreen";
import JournalScreen from "./app/screens/JournalScreen";
import ChatBotScreen from "./app/screens/ChatBotScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Feature" component={FeatureScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="ChatBot" component={ChatBotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// // For testing one screen
// function App() {
//   return <SettingsScreen />;
// }

export default App;
