import React from "react";

import WelcomeScreen from "./app/screens/WelcomeScreen";
import FeatureScreen from "./app/screens/FeatureScreen";
import MainScreen from "./app/screens/MainScreen";
import JournalScreen from "./app/screens/JournalScreen";
import CalendarScreen from "./app/screens/CalendarScreen";
import ChatBotScreen from "./app/screens/ChatbotScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Feature" component={FeatureScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
