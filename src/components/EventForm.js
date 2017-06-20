import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  DatePickerAndroid,
  TimePickerAndroid
} from 'react-native';
import {Container, Content, Form, Item, Input, Label, Button, ListItem, Radio} from 'native-base';
import {connect} from 'react-redux';
import {submitForm, cleanForm} from '../states/events-form-actions';

import moment from 'moment';

import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../theme.js';

class EventForm extends Component {
    static navigationOptions = {
      tabBarLabel: 'New Event'
    };

    constructor(props){
        super(props);
        this.state = {
            title: '',
            startTime: null,
            endTime: null,
            transportation: 'walking',
            description: '',
            location: '',
            geoLocation: {},
            timeInvalid: true
        };
    }

    render() {
        return (
          <Container>
            <Content style={{backgroundColor: '#F5FCFF'}}>
              <Form>
                <Item style={{margin: 10}} floatingLabel>
                  <Label>Title</Label>
                  <Input/>
                </Item>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button style={{margin: 10, width:110}} primary onPress={() => this.onStartTimeClicked()}>
                      <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>Start Time</Text>
                    </Button>
                    <Text style={{color: this.state.timeInvalid?'red':theme.themeColorDark, flex:1, textAlign: 'center', fontSize: 17}}>{this.state.startTime?this.state.startTime.format('MMM D, YYYY ddd hh:mm a'):""}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button style={{margin: 10, width:110}} primary onPress={() => this.onEndTimeClicked()}>
                      <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>End Time</Text>
                    </Button>
                    <Text style={{color: this.state.timeInvalid?'red':theme.themeColorDark, flex:1, textAlign: 'center', fontSize: 17}}>{this.state.endTime?this.state.endTime.format('MMM D, YYYY ddd hh:mm a'):""}</Text>
                  </View>
              </Form>
            </Content>
          </Container>
        );
    }


  async onStartTimeClicked(){
      try {
        let {action, year, month, day} = await DatePickerAndroid.open({
          date: this.state.startTime?this.state.startTime.toDate():new Date(),
          maxDate: this.state.endTime?this.state.endTime.toDate():undefined
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          try {
              let {action, hour, minute} = await TimePickerAndroid.open({
                hour: this.state.startTime?this.state.startTime.hour():moment().hour(),
                minute: this.state.startTime?this.state.startTime.minute():moment().minute(),
                is24Hour: false,
              });
              if (action !== TimePickerAndroid.dismissedAction) {
                this.setState({
                    startTime: moment({year, month, day, hour, minute})
                }, () => this.alertInvalidTime());
              }
          } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
          }
        }
      } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
      }
  }

  async onEndTimeClicked(){
      try {
        let {action, year, month, day} = await DatePickerAndroid.open({
          date: this.state.endTime?this.state.endTime.toDate():new Date(),
          minDate: this.state.startTime?this.state.startTime.toDate():undefined
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          try {
              let {action, hour, minute} = await TimePickerAndroid.open({
                hour: this.state.endTime?this.state.endTime.hour():moment().hour(),
                minute: this.state.endTime?this.state.endTime.minute():moment().minute(),
                is24Hour: false,
              });
              if (action !== TimePickerAndroid.dismissedAction) {
                this.setState({
                    endTime: moment({year, month, day, hour, minute})
                }, () => this.alertInvalidTime());
              }
          } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
          }
        }

      } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
      }
  }

  alertInvalidTime(){
      if(this.state.startTime&&this.state.endTime&&this.state.endTime.unix()>=this.state.startTime.unix()){
        this.setState({
            timeInvalid: false
        });
      }else{
        this.setState({
            timeInvalid: true
        });
        if(this.state.startTime&&this.state.endTime)
            Alert.alert(
              'Invalid Time',
              'Start time must before end time.',
              [
                {text: 'OK'},
              ],
              { cancelable: false }
            )
      }
  }

}

export default connect((state, ownProps) => ({
    ...state.eventsForm
}))(EventForm);
