import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {connect} from 'react-redux';
import Map from './Map.js';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../theme.js';

import PushContoller from './PushContoller.js';
import PushNotification from 'react-native-push-notification';

import {updateLeaveTimeStart} from '../states/calendar-actions.js';

const backgroundColors= {normal: theme.themeColorDark, ok: '#17dfab', leave: '#fe003d'};

var leaveTimeInterval = null;
class Today extends Component {

    static navigationOptions = {
      tabBarLabel: 'Home'
    };
    constructor(props) {
      super(props);

      this.state = {
        infoBackground: backgroundColors.normal,
        message: 'Na',
        lastNextEvent: 'Na',
        notified: false
      }
    }

    componentDidMount(){
      leaveTimeInterval = setInterval(this.updateLeaveTime, 1000);
      this.updateLeaveTime();
    }

    componentWillUnmount(){
      clearInterval(leaveTimeInterval);
    }

    updateLeaveTime = () => {
      let notifyFlag = false;

      let m = this.state.message;
      let ibc = this.state.infoBackground;
      let n = this.state.notified;
      let last = this.state.lastNextEvent;
      if(Number.isNaN(this.props.leaveTime)||!this.props.leaveTime||!this.props.nextEvent){
        this.setState({
          infoBackground: backgroundColors.normal,
          message: 'Na',
          lastNextEvent: 'Na',
          notified: false
        });
        return;
      }
      if(this.state.lastNextEvent !== this.props.eventId){
        last = this.props.eventId;
        n = false;
        ibc = backgroundColors.normal;
        m= 'Na';
      }
      if(this.props.leaveTime < 300 && !n){
        let intTime = parseInt(this.props.leaveTime/60);
        m = `Leave in ${intTime} min(s).`;
        if(this.props.leaveTime <= 0){
          m = `Should leave already.`;
        }
        ibc = backgroundColors.leave;
        n = true;
        notifyFlag = true;
      }
      this.setState({
        infoBackground: ibc,
        message : m,
        notified: n,
        lastNextEvent: last
      },()=>{
        if(notifyFlag){
          this.notify();
        }
      });

    }
    notify = () =>{
      /*----Push Notification Test----------*/
      PushNotification.localNotification({
          /* iOS and Android properties */
          title: "Timemap Reminder",
          message: this.state.message,
          playSound: true,
          soundName: 'default',
          /* Android Only Properties */
          autoCancel: true, // (optional) default: true
          subText: "Timemap", // (optional) default: none
          color: "red", // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      });
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
          <View style={styles.container}>
            <View style={{height:"55%", width:"100%"}}>
                <View style={styles.today}>
                    <Text style={styles.todayDateText}>{moment().format('MMM D, YYYY')}</Text>
                    <Text style={styles.todayDateOfWeekText}>{moment().format('dddd')}</Text>
                </View>
                <View style={[styles.info, {backgroundColor: this.state.infoBackground}]}>
                {
                  this.props.nextEvent?
                  <View>
                    <Text style={[styles.textLight,{ marginBottom: 4, fontSize: size*1}]}><Icon name="bullseye" size={size} color={theme.themeColorLight} />&nbsp;&nbsp; Next Event{"\n"}</Text>
                    <Text style={[styles.textLight, {marginBottom: size, fontSize: size*2, paddingLeft:size*1.8, borderLeftWidth:7, borderColor:"rgb(56, 237, 123)"}]}>{this.props.title}</Text>
                    <Text style={[styles.textLight, {fontSize: size*0.9, margin:2, color: '#ccc'}]}><Icon name="bell-o" iconStyle={{marginRight: 20}} size={size} color={'#ddd'/*theme.themeColorLight*/} />{this.props.lat?`  Should leave ${moment.duration(this.props.leaveTime, 'seconds').humanize(true)}`:'Location not set'}</Text>
                    <Text style={[styles.textLight, {fontSize: size*0.9, margin:2, color: '#ccc'}]}><Icon name="clock-o" size={size} color={'#ddd'/*theme.themeColorLight*/} />&nbsp;&nbsp; {moment(this.props.startTs).format('MMM D, YYYY')}</Text>
                    <Text style={[styles.textLight, {fontSize: size*0.9, margin:2, color: '#ccc', paddingLeft:size/4}]}><Icon name="map-marker" size={size} color={'#ccc'/*theme.themeColorLight*/} />&nbsp;&nbsp;&nbsp; {this.props.location}</Text>
                  </View>:
                  <Text style={{fontSize: size*2, color: theme.themeColorLight}}>No Next Event</Text>
                }

              </View>
            </View>
            <View style={{height:"45%", width:"100%"}}>
              <Map pinable={false} showNextEvent={true}/>
            </View>
            <PushContoller />
          </View>
        );
    }
}
const size = 16;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  today: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  info: {
    flex: 7,
    justifyContent: 'center',
    paddingLeft: size*3,
    backgroundColor: theme.themeColorDark
  },
  textLight: {
    fontSize: size,
    color: theme.themeColorLight
  },
  textDark: {
    fontSize: size*1.5,
    color: theme.themeColorDark,
  },
  todayDateText: {
    fontSize: size,
    color: '#666',
  },
  todayDateOfWeekText: {
    fontSize: size*1.6,
    color: theme.themeColorDark,
  }
});

export default connect((state, ownProps) => ({
    ...state.calendar.nextEvent,
    leaveTime: state.calendar.leaveTime,
    nextEvent: state.calendar.nextEvent
}))(Today);
