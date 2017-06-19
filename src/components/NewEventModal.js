import React, { Component } from 'react';
import {
  DatePickerAndroid,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ListItem,
  ScrollView,
  TouchableWithoutFeedback,

} from 'react-native';
import {Input} from 'native-base'
import {connect} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class NewEventModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      presetDate: new Date(),
      StartDate: new Date(),
      EndDate: new Date(),
      StartText: 'Select Start Date',
      EndText: 'Select End Date',
    }
  }
  showPicker = async (stateKey, options) => {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open();
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = `Select ${stateKey} Date`;
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };


  render() {
    const dateSelectTest = (
      <View>
        <View title="Start date picker">
          <TouchableWithoutFeedback
            onPress={this.showPicker.bind(this, 'Start', {
              date: this.state.StartDate,
            })}>
            <Text >{this.state.StartText}</Text>
          </TouchableWithoutFeedback>
        </View>
        <View title="End date picker">
          <TouchableWithoutFeedback
            onPress={this.showPicker.bind(this, 'End', {
              date: this.state.endDate,
              minDate: this.state.StartDate
              })}>
            <Text >{this.state.EndText}</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
      return (
      <View style={{flex: 1}}>
        <View style={styles.newEventHeader}>
          <Text style={styles.newEventHeaderText}>New Event</Text>
        </View>
        <ScrollView style={[styles.newEventForm, styles.border]}>
          <View style={[styles.title, styles.border]}>
            <Text style={[styles.titleText, styles.border]}>Title</Text>
            <Input style={[styles.titleInput, styles.border]} placeholder='Title'></Input>
          </View>
          <View style={[styles.time, styles.border]}>
            <View style={[styles.start, styles.border]}>
              <View style={[styles.startDate, styles.border]}></View>
              <View style={[styles.startTime, styles.border]}></View>
            </View>
            <View style={[styles.end, styles.border]}>
              <View style={[styles.endDate, styles.border]}></View>
              <View style={[styles.endTime, styles.border]}></View>
            </View>
          </View>
          <View style={[styles.label, styles.border]}></View>
          <View style={[styles.transportation, styles.border]}></View>
          <View style={[styles.description, styles.border]}></View>
          <View style={[styles.location, styles.border]}></View>
          <View style={[styles.map, styles.border]}></View>
          <View style={[styles.formButtons, styles.border]}>
            <View style={[styles.submit, styles.border]}></View>
            <View style={[styles.cancel, styles.border]}></View>
          </View>
        </ScrollView>
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
 newEventHeader: {
   flex: 1,
   backgroundColor: '#09bdac',
   justifyContent: 'center'
 },
 newEventHeaderText: {
   color: '#fff',
   fontSize: 30,
   marginLeft: 25
 },
 newEventForm: {
   flex: 5,
   backgroundColor: '#FFF',
   padding: 15
 },
 title: {
   flex: 1
 },
 time: {
   flex: 1,
   flexDirection: 'row'
 },
 start: {
   flex: 1
 },
 startDate: {
   flex: 1
 },
 startTime: {
   flex: 1
 },
 end: {
   flex: 1
 },
 endDate: {
   flex: 1
 },
 endTime: {
   flex: 1
 },
 label: {
   flex: 1
 },
 transportation: {
   flex: 1
 },
 description: {
   flex: 1
 },
 location: {
   flex: 1
 },
 map: {
   flex: 1
 },
 formButtons: {
   flex: 1,
   flexDirection: 'row'
 },
 submit: {
   flex: 1
 },
 cancel:{
   flex: 1
 },
 titleText: {
   flex: 1
 },
 titleInput: {
   flex: 1
 }

});
