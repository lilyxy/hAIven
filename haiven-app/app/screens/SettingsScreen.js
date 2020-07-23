import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import colors from "../config/colors";
import { Footer } from "../components/Footer";
import { Entypo } from "@expo/vector-icons";

export class Input extends React.Component {
  render() {
    return (
      <View style={styles.input}>
        <Text>{this.props.input}</Text>
        <TextInput style={styles.textInput} />
      </View>
    );
  }
}

export class Setting extends React.Component {
  state = {
    modalVisible: false,
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  render() {
    const { modalVisible } = this.state;
    return (
      <View>
        <Modal transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(false);
                }}
              >
                <Entypo name="circle-with-cross" size={25} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalText}>{this.props.tip}</Text>
            </View>
          </View>
        </Modal>

        <View style={styles.subheadingContainer}>
          <Text style={styles.subheading}>{this.props.subheading}</Text>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Entypo name="help-with-circle" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.information}>
          <Input input={this.props.input1} />
          <Input input={this.props.input2} />
        </View>
      </View>
    );
  }
}

export default function SettingsScreen() {
  return (
    <View style={styles.containter}>
      <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 40 }}>
        Settings
      </Text>
      <Setting
        subheading="Emergency Contact"
        input1="Name"
        input2="Phone Number"
        tip="Your emergency contact will be called if we believe your life may be in danger. 
        This will happen if you fail to check in with the application within x amount of time after an extremely aggressive encounter is deteceted."
      />
      <Setting subheading="Location" input1="City" input2="Address" />
      <Setting
        subheading="Passcode"
        input1="Calculator"
        input2="Emergency Contat"
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  containter: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  subheadingContainer: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  information: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    padding: 5,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    alignSelf: "stretch",
    width: "60%",
    paddingHorizontal: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
