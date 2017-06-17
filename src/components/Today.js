import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {connect} from 'react-redux';
import Map from './Map.js';

export default class Today extends Component {
    static navigationOptions = {
      tabBarLabel: 'Home'
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
          <View style={styles.container}>
            <View style={{height:"50%", width:"100%"}}>
              <Map pinable={false}/>
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
  }
});
