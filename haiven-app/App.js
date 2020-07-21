import React, { useEffect } from "react";

import CalculatorScreen from "./app/screens/CalculatorScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import FeatureScreen from "./app/screens/FeatureScreen";
import MainScreen from "./app/screens/MainScreen";
import CalendarScreen from "./app/screens/CalendarScreen";
import JournalScreen from "./app/screens/JournalScreen";
import ChatBotScreen from "./app/screens/ChatBotScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const authContext = React.useMemo(() => ({
    signIn: () => {
      setIsLoading(false);
    },
    signOut: () => {
      setUserToken(null);
      setIsLoading(false);
    },
    signUp: () => {
      setUserToken("fgkj");
      setIsLoading(false);
    },
  }));

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Feature" component={FeatureScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="ChatBot" component={ChatBotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// // For testing one screen
// function App() {
//   return <CalculatorScreen />;
// }

export default App;
