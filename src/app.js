import React from 'react';
import {BackHandler, AsyncStorage, Text, View, ActivityIndicator} from 'react-native';


import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import {Provider, connect} from 'react-redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import {calendar} from './states/calendar-reducers.js';
import {map} from './states/map-reducers.js';
import {main} from './states/main-client-reducers.js';
import {todayNextEvent} from './states/today-reducers.js';
import {eventsForm} from './states/events-form-reducers.js';

import {initCalendar, setUserId} from './states/calendar-actions';

import {StyleProvider, Container, Header, Body, Title} from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

import {TabNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import Today from './components/Today.js';
import Calendar from './components/Calendar.js';
import Settings from './components/Settings.js';
import theme from './theme.js';

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

class AppWithStyleAndNavigator extends React.Component {
    render() {
        return (
            <Container>
                <Header noShadow={true}>
                    <Body>
                        <Title>{this.props.nav.routes[this.props.nav.index].routeName}</Title>
                    </Body>
                </Header>
                <AppNavigator navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                })}/>
            </Container>
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
}),
undefined,
compose(applyMiddleware(thunkMiddleware, loggerMiddleware), autoRehydrate()));

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true
        };
        persistStore(store, {storage: AsyncStorage}, () => {
            store.dispatch(initCalendar());
            this.setState({
                loading: false
            });
            clearInterval(this.loadingId);
        });
    }
    render() {
        if(this.state.loading)
            return(
                <View
                  style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                    <View style={{flex:5}}/>
                    <View style={{flex:3}}>
                      <ActivityIndicator color={theme.themeColorLight}/>
                      <Text
                        style={{
                          fontSize:16,
                          color: theme.themeColorLight,

                        }}>Loading...</Text>
                    </View>
                </View>
            );
        return (
            <Provider store={store}>
                <StyleProvider style={getTheme(platform)}>
                    <AppWithNavState/>
                </StyleProvider>
            </Provider>
        );
    }
}
