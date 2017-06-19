import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import { Fab, Button, Container } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-simple-modal';
import {CalendarList} from 'react-native-calendars';
import EventsListModal from './EventsListModal.js';

export default class Calendar extends Component {
  static navigationOptions = {
    tabBarLabel: 'Calendar'
  };
  constructor(props) {
    super(props);

    this.state = {
      selected: '2017-06-18',
      markedDays: {
        '2017-06-18': {marked: true, selected: true},
        '2017-06-30': {marked: true},
        '2017-07-30': {marked: true},
      },
      isModalVisible: false,
      fabActive: false,
    }
    this.onDayPress = this.onDayPress.bind(this);
  }

  _showModal = () => this.setState({ isModalVisible: true })

  _hideModal = () => this.setState({ isModalVisible: false })

  onDayPress(day) {
    let tempMarked = {};
    for(i in this.state.markedDays){
      tempMarked[i] = this.state.markedDays[i];
    }
    if(tempMarked[this.state.selected]){
      if(tempMarked[this.state.selected]['marked']){
        tempMarked[this.state.selected] = {marked: true};
      }
      else{
        tempMarked[this.state.selected] = {};
      }
    }
    if(tempMarked[day.dateString]){
      if(tempMarked[day.dateString]['marked']){
        tempMarked[day.dateString] = {marked: true, selected: true};
      }
      else{
        tempMarked[day.dateString] = {selected: true};
      }
    }
    else{
      tempMarked[day.dateString] = {selected: true};
    }
    this.setState({
      selected: day.dateString,
      markedDays: tempMarked
    });
    this._showModal();
  }
  render() {
    const calendarList = (
      <CalendarList
        theme={{
        calendarBackground: '#F5FCFF',
        textSectionTitleColor: '#bbb',
        selectedDayBackgroundColor: '#17dfab',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#17dfab',
        dayTextColor: '#888',
        textDisabledColor: '#eee',
        dotColor: '#17dfab',
        selectedDotColor: '#ffffff',
        arrowColor: '#17dfab',
        monthTextColor: '#17dfab'
      }}

      onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
      onDayPress={this.onDayPress}
      style={styles.calendar}
      markedDates={this.state.markedDays}
    />
    );

    return (
      <View style={{ flex: 1}}>
        <Container>
          <Fab
              active={this.state.fabActive}
              containerStyle={{ marginRight: 10 }}
              style={{ backgroundColor: '#17dfab' }}
              onPress={() => this.setState({ fabActive: !this.state.fabActive, isModalVisible: true })}>
              <Icon name="plus" />
          </Fab>
          {calendarList}
          <Modal
          offset={this.state.offset}
          animationDuration={600}
  	      animationTension={30}
          overlayBackground={'rgba(0, 0, 0, 0.6)'}
          open={this.state.isModalVisible}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={this._hideModal}
          modalStyle={{padding: 0, borderRadius: 5}}>
            <EventsListModal date={this.state.selected}/>
          </Modal>
        </Container>

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
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

});
