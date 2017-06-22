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
import {submitForm} from '../states/events-form-actions';

import moment from 'moment';

import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../theme.js';

class EventForm extends Component {
    static navigationOptions = {
        title: "Add Event"
    };
    constructor(props){
        super(props);
        this.state = {
            ...this.props.eventForm,
            startTs: this.props.eventForm.startTs?moment(this.props.eventForm.startTs):null,
            endTs: this.props.eventForm.endTs?moment(this.props.eventForm.endTs):null,
            titleValid: true
        };
    }

    componentWillUpdate(nextProps, nextState){
        if(this.state!==nextState)
            this.props.dispatch(submitForm(nextState));
    }

    render() {
        return (
          <Container>
            <Content style={{backgroundColor: '#F5FCFF'}}>
              <Form>
                <Item style={{margin: 10}} floatingLabel error={!this.state.titleValid}>
                  <Label>Title</Label>
                  <Input value={this.state.title} onChange={(e) => this.setState({title: e.nativeEvent.text, titleValid: true})}/>
                </Item>

                <View style={{margin: 10}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button style={{margin: 10, width:110}} primary onPress={() => this.onStartTimeClicked()}>
                      <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>Start Time</Text>
                    </Button>
                    <Text style={{color: this.state.timeInvalid?'red':theme.themeColorDark, flex:1, textAlign: 'center', fontSize: 17}}>{this.state.startTs?this.state.startTs.format('MMM D, YYYY ddd hh:mm a'):""}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button style={{margin: 10, width:110}} primary onPress={() => this.onEndTimeClicked()}>
                      <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>End Time</Text>
                    </Button>
                    <Text style={{color: this.state.timeInvalid?'red':theme.themeColorDark, flex:1, textAlign: 'center', fontSize: 17}}>{this.state.endTs?this.state.endTs.format('MMM D, YYYY ddd hh:mm a'):""}</Text>
                  </View>
                </View>

                <View style={{margin:10}}>
                  <Label>Transportation</Label>
                  <ListItem>
                    <Radio
                      onPress={() => this.setState({
                        walking: !this.state.walking,
                        driving: false,
                        cycling: false,
                        transportation: 'walking',
                      })}
                      selected={this.state.walking} />
                      <Text>&nbsp;&nbsp;Walking</Text>
                  </ListItem>
                  <ListItem>
                    <Radio
                      onPress={() => this.setState({
                        walking: false,
                        driving: !this.state.driving,
                        cycling: false,
                        transportation: 'driving',
                      })}
                      selected={this.state.driving} />
                      <Text>&nbsp;&nbsp;Driving</Text>
                  </ListItem>
                  <ListItem>
                    <Radio
                      onPress={() => this.setState({
                        walking: false,
                        driving: false,
                        cycling: !this.state.cycling,
                        transportation: 'cycling',
                      })}
                      selected={this.state.cycling} />
                      <Text>&nbsp;&nbsp;Cycling</Text>
                  </ListItem>
                </View>

                <Item style={{margin: 10}} floatingLabel>
                  <Label>Description</Label>
                  <Input value={this.state.description} onChange={(e) => this.setState({description: e.nativeEvent.text})}/>
                </Item>

                <Item style={{margin: 10}} floatingLabel>
                  <Label>Location</Label>
                  <Input value={this.state.location} onChange={(e) => this.setState({location: e.nativeEvent.text})}/>
                </Item>
              </Form>
              <Button style={{margin: 50}} block primary onPress={() => this.handleSubmit()}>
                <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>Next</Text>
              </Button>
            </Content>
          </Container>
        );
    }

    handleSubmit(){
        if(!this.state.title){
            this.setState({
                titleValid: false
            });
            Alert.alert(
              'Invalid Title',
              'Must have title',
              [
                {text: 'OK'},
              ],
              { cancelable: false }
            );
            return;
        }
        if(this.state.timeInvalid){
          Alert.alert(
            'Invalid Time',
            'Time not valid',
            [
              {text: 'OK'},
            ],
            { cancelable: false }
          );
            return;
        }
        this.props.navigation.navigate('AddEventMap');
    }

  async onStartTimeClicked(){
      try {
        let {action, year, month, day} = await DatePickerAndroid.open({
          date: this.state.startTs?this.state.startTs.toDate():new Date(),
          maxDate: this.state.endTs?this.state.endTs.toDate():undefined
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          try {
              let {action, hour, minute} = await TimePickerAndroid.open({
                hour: this.state.startTs?this.state.startTs.hour():moment().hour(),
                minute: this.state.startTs?this.state.startTs.minute():moment().minute(),
                is24Hour: false,
              });
              if (action !== TimePickerAndroid.dismissedAction) {
                this.setState({
                    startTs: moment({year, month, day, hour, minute})
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
          date: this.state.endTs?this.state.endTs.toDate():new Date(),
          minDate: this.state.startTs?this.state.startTs.toDate():undefined
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          try {
              let {action, hour, minute} = await TimePickerAndroid.open({
                hour: this.state.endTs?this.state.endTs.hour():moment().hour(),
                minute: this.state.endTs?this.state.endTs.minute():moment().minute(),
                is24Hour: false,
              });
              if (action !== TimePickerAndroid.dismissedAction) {
                this.setState({
                    endTs: moment({year, month, day, hour, minute})
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
      if(this.state.startTs&&this.state.endTs&&this.state.endTs.unix()>=this.state.startTs.unix()){
        this.setState({
            timeInvalid: false
        });
      }else{
        this.setState({
            timeInvalid: true
        });
        if(this.state.startTs&&this.state.endTs)
            Alert.alert(
              'Invalid Time',
              'Start time must before end time.',
              [
                {text: 'OK'},
              ],
              { cancelable: false }
            );
      }
  }

}

export default connect((state, ownProps) => ({
    eventForm: state.eventsForm
}))(EventForm);
