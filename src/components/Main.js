import React from 'react';
import {TabNavigator} from 'react-navigation';
import Today from './Today.js';
import Calendar from './Calendar.js';
import Settings from './Settings.js';
import theme from '../theme.js';

const AppNavigator = TabNavigator({
    Home: {screen: Today},
    Calendar: {screen: Calendar},
    Settings: {screen: Settings}
}, {
    tabBarPosition: 'top',
    tabBarOptions: {
        activeTintColor: theme.themeColorLight,
        indicatorStyle: {
            backgroundColor: theme.themeColorLight
        },
        style: {
            backgroundColor: theme.themeColorDark
        },
        upperCaseLabel: false
    },
    initialRouteName: 'Home'
}
);

export default class Main extends React.Component {
    static navigationOptions = {
      title: "Timemap"
    };
    render() {
        return (
          <AppNavigator />
        );
    }
}
