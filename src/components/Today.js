import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class Today extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
          <View style={styles.container}>
            <Text>Today</Text>
            <Button title="Calendar" onPress={() => navigate('Calendar')} />
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
