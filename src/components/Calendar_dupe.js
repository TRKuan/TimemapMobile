import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Button,
  Dimensions,
  ListItem,
  ScrollView
} from 'react-native';
import {
  Container,
  Header,
  Col,
  Row
} from 'native-base';

var {
  height: deviceHeight
} = Dimensions.get('window');

//import Modal from 'react-native-modal';
import Modal from 'react-native-simple-modal';


import InfiniteScrollView from 'react-native-infinite-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import {CalendarList, Calendar as CalendarFromNPM} from 'react-native-calendars';

import CalendarMonthDay from './CalendarMonthDay.js';
import CalendarMonthWeek from './CalendarMonthWeek.js';
export default class Calendar extends Component {
  static navigationOptions = {
    tabBarLabel: 'Calendar'
  };
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2', 'row 3'/*, 'row 4', 'row 5', 'row 6', 'row 7', 'row 8', 'row 9', 'row 2', 'row 10', 'row 11', 'row 12', 'row 13','row 14', 'row 15', 'row 16', 'row 17', 'row 18', 'row 19', 'row 20','row 21', 'row 22', 'row 23', 'row 24', 'row 25', 'row 26', 'row 27'*/]),
      canLoadMoreContent: true,
      currentMonth: 'June',
      selected: '2017-06-18',
      markedDays: {
        '2017-06-18': {marked: true, selected: true},
        '2017-06-30': {marked: true},
        '2017-07-30': {marked: true},
      },
      isModalVisible: false,
      offset: 0
    }

    this.onDayPress = this.onDayPress.bind(this);
  }

  _showModal = () => this.setState({ isModalVisible: true })

  _hideModal = () => this.setState({ isModalVisible: false })

  loadMoreContentAsync = async () =>{
    this.setState({
      items: {},
      dataSource: this.state.dataSource.cloneWithRows(['row99', 'row99', 'row99', /*'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99', 'row99','row 1', 'row 2', 'row 3', 'row 4', 'row 5', 'row 6', 'row 7', 'row 8', 'row 9', 'row 2', 'row 10', 'row 11', 'row 12', 'row 13','row 14', 'row 15', 'row 16', 'row 17', 'row 18', 'row 19', 'row 20','row 21', 'row 22', 'row 23', 'row 24', 'row 25', 'row 26', 'row 27'*/]),
    });
  }
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
    const weekBar = (
      <Row size={1} style={[styles.week]}>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Sun</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Mon</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Tue</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Wed</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Thu</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Fri</Text></Col>
        <Col style={[styles.dayOfWeek, /*styles.border*/]}><Text style={styles.lightColorText}>Sat</Text></Col>
      </Row>
    );
    const month = (
        <View>
          <CalendarMonthWeek />
          <CalendarMonthWeek />
          <CalendarMonthWeek />
          <CalendarMonthWeek />
          <CalendarMonthWeek />
          <CalendarMonthWeek />
          <CalendarMonthWeek />
        </View>
    );
    const temp = (
      <Container style={{backgroundColor: "#F5FCFF"}}>
        <Col size={1} style={[styles.calendarHeader, /*styles.border*/]}>
          <Row size={3} style={[styles.calendarMonthYearDisplay, , /*styles.border*/]}>
            <Text style={[styles.calendarMonthText, styles.lightColorText, , /*styles.border*/]}>
              DECEMBER 2017
            </Text>
          </Row>
          {weekBar}
        </Col>
        <Col size={5} style={styles.daysContainer}>
          <ListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            dataSource={this.state.dataSource}
            distanceToLoadMore={10}
            renderRow={(row) => <Text>{row}</Text>}
            canLoadMore={this.state.canLoadMoreContent}
            onLoadMoreAsync={this.loadMoreContentAsync}
          />
        </Col>
      </Container>
    );
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
    const CalendarListAndModal = (
      <Modal
        isVisible={this.state.isModalVisible}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
        hideOnBack={true}
      >
        <View style={{ flex: 1}}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>June 18, 2017</Text>
          </View>
        </View>
        <View style={{ flex: 3}}>
          <View style={styles.item}>
            <View style={styles.eventName}><Text>Event</Text></View>
            <View style={styles.eventTime}><Text>Location</Text></View>
            <View style={styles.eventLocation}><Text>Time</Text></View>
          </View>
          <View style={styles.item}>
            <View style={styles.eventName}><Text>Event</Text></View>
            <View style={styles.eventTime}><Text>Location</Text></View>
            <View style={styles.eventLocation}><Text>Time</Text></View>
          </View>
          <View style={styles.item}>
            <View style={styles.eventName}><Text>Event</Text></View>
            <View style={styles.eventTime}><Text>Location</Text></View>
            <View style={styles.eventLocation}><Text>Time</Text></View>
          </View>
          <View style={styles.item}>
            <View style={styles.eventName}><Text>Event</Text></View>
            <View style={styles.eventTime}><Text>Location</Text></View>
            <View style={styles.eventLocation}><Text>Time</Text></View>
          </View>
          <View style={styles.item}>
            <View style={styles.eventName}><Text>Event</Text></View>
            <View style={styles.eventTime}><Text>Location</Text></View>
            <View style={styles.eventLocation}><Text>Time</Text></View>
          </View>
          <View style={styles.item}>
            <View style={styles.eventName}><Text>Event</Text></View>
            <View style={styles.eventTime}><Text>Location</Text></View>
            <View style={styles.eventLocation}><Text>Time</Text></View>
          </View>
        </View>
        <Button title='Hide' onPress={this._hideModal}>
          <Text>Hide Modal</Text>
        </Button>
      </Modal>
    );
    const eventItem = (
      <View style={styles.item}>
        <View style={styles.eventName}><Text>Event</Text></View>
        <View style={styles.eventTime}><Text>Location</Text></View>
        <View style={styles.eventLocation}><Text>Time</Text></View>
      </View>
    );

    return (
      <View style={{ flex: 1}}>
        {calendarList}
        <Modal
        offset={this.state.offset}
        open={this.state.isModalVisible}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={this._hideModal}
        modalStyle={{padding: 0, borderRadius: 5}}>
          <View style={{padding: 0, height: 80}}>
            <View style={styles.dayHeader}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={styles.eventsText}>Events</Text>
                  <Text style={styles.dayHeaderText}>June 18,&nbsp;&nbsp;2017</Text>
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
          <ScrollView style={{maxHeight: 390}}>
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
            {eventItem}
          </ScrollView>

        </Modal>


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
  calendarHeader: {
    backgroundColor: "#17dfab",
    justifyContent: "center",
    alignItems: "center",

  },
  calendarMonthYearDisplay: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  calendarMonthText: {
    fontSize: 25
  },
  dayOfWeek:{
    //borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  week:{
    paddingLeft: 15,
    paddingRight: 15
  },
  daysContainer: {
    paddingTop: 5,
    paddingBottom: 5,
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
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  item: {
   backgroundColor: '#F5FCFF',
   height: 60,
   borderColor: '#ccc',
   borderBottomWidth: 1,
   flexDirection: 'row',
   alignItems: 'center',
   padding: 15,
   margin: 2,
   marginRight: 5,
   marginLeft: 5
 },
 emptyDate: {
   height: 15,
   flex:1,
   paddingTop: 30
 },
 dayHeader: {
    flex: 1,
    backgroundColor: '#17dfab',
    padding: 15,
    paddingLeft: 20,
    borderRadius: 4,
    height: 80,
    marginBottom: 2
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
   flex: 1
 },
 eventLocation:{
   flex: 1
 }
});
