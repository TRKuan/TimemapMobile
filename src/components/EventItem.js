import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

export default class EventItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const startTime = moment(this.props.startTs).format('LT');
    const endTime = moment(this.props.endTs).format('LT');
    console.log('in event item: startTime', startTime)

    return (
      <View style={styles.item}>
        <View style={styles.eventName}><Text style={styles.darkColorText}>{this.props.title}</Text></View>
        <View style={styles.eventTime}><Text style={styles.darkColorText}>{startTime}</Text></View>
        <View style={styles.eventLocation}><Text style={styles.darkColorText}>{this.props.location}</Text></View>
      </View>
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
  item: {
   backgroundColor: '#F5FCFF',
   height: 60,
   borderColor: '#bbb',
   borderBottomWidth: 1,
   borderLeftColor: '#17dfab',
   borderLeftWidth: 5,
   flexDirection: 'row',
   alignItems: 'center',
   padding: 15,
   margin: 2,
   marginRight: 5,
   marginLeft: 5
 },
 eventsText:{
   color: '#fff',
   fontSize: 16,
 },
 eventName:{
   flex: 1,
 },
 eventTime:{
   flex: 1
 },
 eventLocation:{
   flex: 1
 }
});
