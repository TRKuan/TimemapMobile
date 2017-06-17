import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {connect} from 'react-redux';

class Today extends Component {
    static navigationOptions = {
      tabBarLabel: 'Home'
    };

    constructor(props){
        super(props);
        Mapbox.setAccessToken('pk.eyJ1IjoidHJrdWFuIiwiYSI6ImNqMXlsYnE1ZjAwdHcyeHJxa3lrYWg2dHcifQ.tBkscd-d-S0Z374VcVw3Qg');
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
          <View style={styles.container}>
            <View style={{height:"50%", width:"100%"}}>
              <MapView style={styles.map} />
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    height:"100%",
    width:"100%"
  }
});

export default connect((state, ownProps) => ({
    ...state.calendar,
    ...state.map
}))(Today);
