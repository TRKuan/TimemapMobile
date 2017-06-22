import React, { Component } from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {Container, Header, Left, Body, Right, Content, Icon, Title, Button} from 'native-base';
import {connect} from 'react-redux';
import moment from 'moment';
import {cleanForm} from '../states/events-form-actions';
import {addEvent} from '../states/calendar-actions';
import {setPinPosition} from '../states/map-actions';
import Map from './Map.js';
import theme from '../theme.js';

import {NavigationActions} from 'react-navigation';

class FormMap extends Component {
    static navigationOptions = {
        title: "Set Event Location",
    };
    render() {
        return (
            <View>
              <View style={{height: '90%'}}>
                <Map pinable={true} showNextEvent={false}/>
              </View>
              <View style={{height: '10%', backgroundColor:'black'}}>
                <Button
                  title={"Add"}
                  style={{height: '100%', width: '100%', backgroundColor: theme.themeColorDark}}
                  onPress={() => {
                    this.props.dispatch(NavigationActions.back());
                    this.props.dispatch(NavigationActions.back());
                    this.handleSubmite();
                  }}
                >
                  <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>Add</Text>
                </Button>
              </View>
          </View>
        );
    }
    handleSubmite(){
      let lat, lng;
      if(this.props.pinPosition){
        lat = this.props.pinPosition.latitude;
        lng = this.props.pinPosition.longitude;
      }
      this.props.dispatch(setPinPosition(null));
      try{
        this.props.dispatch(addEvent({
          allDay: false,
          location: this.props.eventForm.location,
          lng,
          lat,
          startTs: moment(this.props.eventForm.startTs).toISOString(),
          endTs: moment(this.props.eventForm.endTs).toISOString(),
          title: this.props.eventForm.title,
          description: this.props.eventForm.description,
          trans: this.props.eventForm.transportation
        }));
        this.props.dispatch(cleanForm());
      }catch(err){
        console.error("add event faild", err.message);
      }
    }

}

export default connect((state, ownProps) => ({
    eventForm: state.eventsForm,
    pinPosition: state.map.pinPosition
}))(FormMap);
