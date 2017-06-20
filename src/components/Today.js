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

class Today extends Component {
    static navigationOptions = {
      tabBarLabel: 'Home'
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
          <View style={styles.container}>
            <View style={{height:"50%", width:"100%"}}>
              <Map pinable={false} showNextEvent={true}/>
            </View>
            <View style={{height:"50%", width:"100%"}}>
                <View style={styles.today}>
                    <Text style={styles.textDark}>{moment().format('MMM D, YYYY')}</Text>
                    <Text style={styles.textDark}>{moment().format('dddd')}</Text>
                </View>
                <View style={styles.info}>
                  <View>
                    <Text style={styles.textLight}><Icon name="bullseye" size={size} color={theme.themeColorLight} /> Next Event{"\n"}</Text>
                    <Text style={[styles.textLight, {fontSize: size*1.5, paddingLeft:size, borderLeftWidth:7, borderColor:"rgb(56, 237, 123)"}]}>{this.props.title}</Text>
                    <Text style={styles.textLight}><Icon name="bell-o" size={size} color={theme.themeColorLight} /> Should leave {moment.duration(this.props.leaveTime, 'seconds').humanize(true)}</Text>
                    <Text style={styles.textLight}><Icon name="clock-o" size={size} color={theme.themeColorLight} /> {moment(this.props.startTs).format('MMM D, YYYY')}</Text>
                    <Text style={[styles.textLight, {paddingLeft:size/4}]}><Icon name="map-marker" size={size} color={theme.themeColorLight} /> {this.props.location}</Text>
                </View>
              </View>
            </View>
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
    height: "30%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  info: {
    height: "70%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.themeColorDark,
  },
  textLight: {
    fontSize: size,
    color: theme.themeColorLight,
  },
  textDark: {
    fontSize: size*1.5,
    color: theme.themeColorDark,
  }
});

export default connect((state, ownProps) => ({
    ...state.calendar.nextEvent,
    leaveTime: state.calendar.leaveTime
}))(Today);
