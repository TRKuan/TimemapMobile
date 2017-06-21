import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import { Fab, Button, Container, Content } from 'native-base';
import FAB from 'react-native-fab'
import Icon from 'react-native-vector-icons/FontAwesome';
import {setDay, calculateMonthHasEvent} from '../states/calendar-actions.js'

//import Icon from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-simple-modal';
import {CalendarList} from 'react-native-calendars';
import EventsListModal from './EventsListModal.js';
import EventsListScreen from './EventsListScreen.js';
import NewEventModal from './NewEventModal.js';
import SnackBar from 'react-native-snackbar-component'

class Calendar extends Component {
  static navigationOptions = {
    tabBarLabel: 'Calendar'
  };
  constructor(props) {
    super(props);

    this.state = {
      selected: '2017-06-21',
      isEventModalVisible: false,
      fabActive: false,
      markedDays: {}
    }
    this.onDayPress = this.onDayPress.bind(this);
  }
  componentDidMount(){
    this.props.dispatch(setDay('2017-06-22')).then(()=>{
      let tempMarked = JSON.stringify(this.props.monthHasEvent);
      tempMarked = JSON.parse(tempMarked);
      this.setState({
        markedDays: tempMarked
      });
    });

  }

  componentWillReceiveProps(){
    if(JSON.stringify(this.props.monthHasEvent) !== JSON.stringify(this.state.markedDays)){
      let tempMarked = JSON.stringify(this.props.monthHasEvent);
      tempMarked = JSON.parse(tempMarked);
      if(tempMarked[this.state.selected]){
        if(tempMarked[this.state.selected]['marked']){
          tempMarked[this.state.selected] = {marked: true, selected: true};
        }
      }
      else{
        tempMarked[this.state.selected] = {selected: true};
      }
      this.setState({
        markedDays: tempMarked
      });
    }
  }

  showEventModal = () => this.setState({ isEventModalVisible: true })

  hideEventModal = () => this.setState({ isEventModalVisible: false })

  onDayPress(day) {
    this.props.dispatch(NavigationActions.navigate({routeName: 'AddEvent'}));
    this.props.dispatch(setDay(day.dateString));  
  }


  showAddModal = () => this.setState({ isAddModalVisible: true })
  hideAddModal = () => this.setState({ isAddModalVisible: false })

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
      <View style={{ flex: 1, backgroundColor: '#fff'}}>
        <View style={{ flex: 1, backgroundColor: '#fff'}}>
          {calendarList}
          <Modal
          offset={this.state.offset}
          animationDuration={600}
          animationTension={30}
          overlayBackground={'rgba(0, 0, 0, 0.6)'}
          open={this.state.isEventModalVisible}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={this.hideEventModal}
          modalStyle={{padding: 0, borderRadius: 5}}>
            <EventsListScreen/>
          </Modal>
          <Modal
          offset={this.state.offset}
          animationDuration={600}
          animationTension={30}
          overlayBackground={'rgba(0, 0, 0, 0.6)'}
          open={this.state.isAddModalVisible}
          modalDidOpen={() => console.log(' add modal did open')}
          modalDidClose={this.hideAddModal}
          modalStyle={{padding: 0, borderRadius: 5, margin: 0}}>
            <View style={{backgroundColor: '#fff', height: 552}}>
              <View style={{flex: 1}}>
                <NewEventModal />
              </View>
              <Button
                full
                style={{backgroundColor: '#09bdac'}}
                onPress={() => this.setState({ fabActive: !this.state.fabActive, isAddModalVisible: false }) }
              >
                <Text style={styles.lightColorText}>Close Modal</Text>
              </Button>
            </View>
          </Modal>
          <FAB
            buttonColor="#09bdac"
            iconTextColor="#FFFFFF"
            onClickAction={() => this.props.dispatch(NavigationActions.navigate({routeName: 'AddEvent'}))}
            visible={!this.state.fabActive}
            iconTextComponent={<Icon name="plus" />}
          />
        </View>
        <SnackBar
          visible={this.props.getDayLoading}
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
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default connect((state) => {
    return {
      ...state.calendar
    };
})(Calendar);
