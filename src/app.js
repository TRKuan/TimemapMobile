import React from 'react';
import {BackHandler} from 'react-native';


import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import {Provider, connect} from 'react-redux';
import {calendar} from './states/calendar-reducers.js';
import {map} from './states/map-reducers.js';
import {main} from './states/main-client-reducers.js';
import {todayNextEvent} from './states/today-reducers.js';
import {eventsForm} from './states/events-form-reducers.js';

import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import Today from './components/Today.js';
import Calendar from './components/Calendar.js';

const AppNavigator = StackNavigator({
    Today: {screen: Today},
    Calendar: {screen: Calendar}
}, {
    headerMode: 'none'
});

class AppWithStyleAndNavigator extends React.Component {
    render() {
        return (
            //<StyleProvider style={getTheme(platform)}>
                <AppNavigator navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                })}/>
            //</StyleProvider>
        );
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            const {dispatch, nav} = this.props;
            if (nav.index === 0)
                return false;
            dispatch(NavigationActions.back());
            return true;
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }
}

const AppWithNavState = connect(state => ({
    nav: state.nav
}))(AppWithStyleAndNavigator);

// Nav reducer
const initialState = AppNavigator.router.getStateForAction(NavigationActions.navigate({routeName: 'Today'}));
const nav = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
};

// Create Redux store
const store = createStore(combineReducers({
    calendar,
    map,
    main,
    todayNextEvent,
    eventsForm,
    nav
}), compose(applyMiddleware(thunkMiddleware, loggerMiddleware)));

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavState/>
            </Provider>
        );
    }
}
