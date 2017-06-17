import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Container,
  Header,
  Col,
  Row
} from 'native-base';

import CalendarMonthDay from './CalendarMonthDay.js';

export default class Calendar extends Component {
  static navigationOptions = {
    tabBarLabel: 'Calendar'
  };

  render() {
    let weekBar = (
      <Row size={1}>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Sun</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Mon</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Tue</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Wed</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Thu</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Fri</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Sat</Text></Col>
      </Row>
    );
    //For static
    let day = (
        <Col style={styles.dayCell}>
            <View style={styles.hasEventBar}>
                <Text style={[styles.darkColorText]}>
                    1
                </Text>
            </View>
        </Col>
    );
    let week = (
        <Row >
            <CalendarMonthDay />
            <CalendarMonthDay />
            <CalendarMonthDay />
            <CalendarMonthDay />
            <CalendarMonthDay />
            <CalendarMonthDay />
            <CalendarMonthDay />
        </Row>
    );

    return (
      <Container style={{backgroundColor: "#F5FCFF"}}>
        <Col size={1} style={styles.calendarHeader}>
          <Row size={3} style={styles.calendarMonthYearDisplay}>
            <Text style={[styles.calendarMonthText, styles.lightColorText]}>
              DECEMBER 2017
            </Text>
          </Row>
          {weekBar}
        </Col>
        <Col size={3}>
            {week}
            {week}
            {week}
            {week}
            {week}
            {week}

        </Col>
      </Container>
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
    backgroundColor: '#F5FCFF',
  },
  calendarHeader: {
    backgroundColor: "#17dfab",
    justifyContent: "center",
    alignItems: "center",

  },
  calendarMonthYearDisplay: {
    //borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  calendarMonthText: {
    fontSize: 40
  },
  dayOfWeek:{
    //borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCell: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  hasEventBar: {
      borderBottomWidth: 5,
      borderColor: "#17dfab",
      paddingTop: 4,
      paddingBottom: 2
  }
});
