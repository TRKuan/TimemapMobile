import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ListItem,
  ScrollView
} from 'react-native';

import {connect} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import SnackBar from 'react-native-snackbar-component';

import {getDayEvents} from '../states/calendar-actions';
import EventItem from './EventItem.js';

class EventsListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
    }
  }

  render() {
    const events = this.props.dayEvents;
    const pickedDay = moment(this.props.pickedDay).format('MMMM D,   YYYY');
    let children = (
        <View style={styles.empty}>
            <Text style={styles.darkColorText}>No Events. Time to relax!</Text>
        </View>
    );

    if(events){
        if (events.length) {
            children = events.map((e, i) => (
                  <EventItem key={i} day={this.props.pickedDay} {...e}/>
            ));
        }
    }

    const withPlusButton = (
      <View>
        <View style={{padding: 0, height: 80}}>
          <View style={styles.dayHeader}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.eventsText}>Events</Text>
                <Text style={styles.dayHeaderText}>{pickedDay}</Text>
              </View>
              <View style={{ justifyContent: 'center', marginRight: 15}}>
                <TouchableOpacity onPress={() => this.setState({isModalVisible: false})}>
                  <Icon name="plus"
                  color='#fff'
                  title="add"
                  size={20}
                  >
                  </Icon>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={{maxHeight: 390, paddingBottom: 5}}>
          {children}
        </ScrollView>
      </View>
    );

    return (
        <View>
          <View style={styles.dayHeader}>
            <View>
              <Text style={styles.eventsText}>Events</Text>
              <Text style={styles.dayHeaderText}>{pickedDay}</Text>
            </View>
          </View>
        <ScrollView style={{height: '83.5%', padding: 5, paddingTop: 10, backgroundColor: 'rgb(238, 232, 232)'}}>
          {children}
        </ScrollView>
        <SnackBar
          visible={this.props.deleteLoading}
          backgroundColor='rgba(38, 38, 38, 0.6)'
          textMessage="Loading..."
          actionHandler={()=>{console.log("snackbar button clicked!")}}
          />
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
   marginLeft: 5,
 },
 empty:{
   height: 100,
   justifyContent: 'center',
   alignItems: 'center',
   margin: 5,
 },
 dayHeader: {
    height: '16.5%',
    backgroundColor: '#17dfab',
    padding: 15,
    paddingLeft: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',

 },
 eventsText:{
   color: '#fff',
   fontSize: 16,

 },
 dayHeaderText: {
   color: '#fff',
   fontSize: 22,

 },
 eventName:{
   flex: 1,
 },
 eventTime:{
   flex: 1,

 },
 eventLocation:{
   flex: 1
 }
});

export default connect(state => ({
    dayEvents: state.calendar.dayEvents,
    pickedDay: state.calendar.pickedDay,
    deleteLoading: state.calendar.deleteLoading
}))(EventsListScreen);
