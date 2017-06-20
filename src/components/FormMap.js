import React, { Component } from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {Container, Header, Left, Body, Right, Content, Icon, Title, Button} from 'native-base';
import {connect} from 'react-redux';
import {submitForm, cleanForm} from '../states/events-form-actions';
import Map from './Map.js';
import theme from '../theme.js';

import {NavigationActions} from 'react-navigation';

class FormMap extends Component {
    static navigationOptions = {
        title: "Add Evnet",
    };
    render() {
        return (
            <View>
              <View style={{height: '90%'}}>
                <Map pinable={true} showNextEvent={false}/>
              </View>
              <View style={{height: '10%', backgroundColor:'black'}}>
                <Button
                  title={"Add"}
                  style={{height: '100%', width: '100%', backgroundColor: theme.themeColorDark}}
                  onPress={() => {
                    this.props.dispatch(NavigationActions.back());
                    this.props.dispatch(NavigationActions.back());
                  }}
                >
                  <Text style={{color: theme.themeColorLight, flex: 1, textAlign: 'center'}}>Add</Text>
                </Button>
              </View>
          </View>
        );
    }

}

export default connect((state, ownProps) => ({
    ...state.eventsForm
}))(FormMap);
