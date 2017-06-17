import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import {
  Container,
  Col,
  Row,

} from 'native-base';


export default class CalendarMonthDay extends Component {
  constructor(props) {
      super(props);

      this.state = {
        backColor: "#F5FCFF",
        dayColor: "#333",
        hasEventBorder: "#17dfab"
      };


  }
  onPressDay = () => {
    this.setState({
      backColor: "#17dfab",
      dayColor: "#F5FCFF",
      hasEventBorder: "#F5FCFF"

    });
    console.log("CalendarMonthDay back color set");
 }

  render() {

    return (
      <TouchableWithoutFeedback onPress={this.onPressDay}>
        <View style={[styles.dayCell, {backgroundColor: this.state.backColor, flex: 1, flexDirection: 'row', borderWidth: 1}]}>
              <View style={[styles.hasEventBar, {borderColor: this.state.hasEventBorder}]}>
                  <Text style={[{color: this.state.dayColor}]}>
                      1
                  </Text>
              </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  border:{
    borderWidth: 1
  },
  lightColorText: {
    color: "#F5FCFF",
  },
  darkColorText: {
    color: "#888",
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  dayCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hasEventBar: {
      borderBottomWidth: 5,
      borderColor: "#17dfab",
      paddingTop: 4,
      paddingBottom: 2
  }
});
