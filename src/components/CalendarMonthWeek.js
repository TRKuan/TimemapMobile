import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Container,
  Col,
  Row,
  ListItem
} from 'native-base';

import CalendarMonthDay from './CalendarMonthDay.js';

export default class CalendarMonthWeek extends Component {

  render() {

    return (
      <Row style={[styles.week]}>
          <CalendarMonthDay />
          <CalendarMonthDay />
          <CalendarMonthDay />
          <CalendarMonthDay />
          <CalendarMonthDay />
          <CalendarMonthDay />
          <CalendarMonthDay />
      </Row>

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
  week:{
    marginLeft: 15,
    marginRight: 15,
    borderBottomWidth: 1,
    borderColor: "#BBB"
  },

});
