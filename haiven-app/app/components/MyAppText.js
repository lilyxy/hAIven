import React from "react";
import { AppLoading } from "expo";
import { Text } from "react-native";

import { useFonts, FjallaOne_400Regular } from "@expo-google-fonts/fjalla-one";

export default function Haiven() {
  let [fontsLoaded] = useFonts({
    FjallaOne_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Text
        style={{
          fontFamily: "FjallaOne_400Regular",
          color: "white",
          fontSize: 50,
        }}
      >
        Haiven
      </Text>
    );
  }
}
