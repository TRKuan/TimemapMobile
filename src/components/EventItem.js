import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Swipeable from 'react-native-swipeable';
import Swipeout from 'react-native-swipeout';



import {deleteEvent} from '../states/calendar-actions.js';

class EventItem extends Component {
  constructor(props) {
    super(props);
  }
  handleDelete = () =>{
    this.props.dispatch(deleteEvent(this.props.eventId, this.props.day));
  }

  render() {

    const startTime = moment(this.props.startTs).format('LT');
    const endTime = moment(this.props.endTs).format('LT');


    const rightButtons = [
      <TouchableHighlight style={styles.deleteButton} onPress={this.handleDelete}><Text style={styles.lightColorText}><Icon name="times" size={15} /></Text></TouchableHighlight>,
      <TouchableHighlight style={styles.editButton}><Text style={styles.lightColorText}><Icon name="pencil" size={15} /></Text></TouchableHighlight>
    ];

    return (
      <View>
        <Swipeable rightButtons={rightButtons}>
          <View style={styles.item}>
            <View style={styles.eventName}><Text style={styles.darkColorText}>{this.props.title}</Text></View>
            <View style={styles.eventTime}><Text style={styles.darkColorText}>{startTime}</Text></View>
            <View style={styles.eventLocation}><Text style={styles.darkColorText}>{this.props.location}</Text></View>
          </View>
        </Swipeable>
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
 },
 deleteButton:{
   backgroundColor: '#f94792',
//   backgroundColor: '#F5FCFF',
   height: 60,
   borderColor: '#bbb',
   borderBottomWidth: 1,
   margin: 2,
   justifyContent: 'center',
//   padding: 18,
   paddingLeft: 32

 },
 deleteButtonText: {
   color: '#f94792'
 },
 editButton:{
   backgroundColor: '#fae36d',
  // backgroundColor: '#F5FCFF',
   height: 60,
   borderBottomColor: '#888',
   borderBottomWidth: 1,
   margin: 2,
   justifyContent: 'center',
  // padding: 22,
   paddingLeft: 28,
   borderLeftColor: 'ghostwhite',
   borderLeftWidth: 4
 },
 editButtonText: {
   color: '#fae36d'
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
export default connect((state, ownProps) => ({

}))(EventItem);
