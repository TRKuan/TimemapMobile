import React from 'react';
import {BackHandler, AsyncStorage, Text, View, ProgressBarAndroid} from 'react-native';


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
import {loading} from './states/loading-reducers.js';

import {initCalendar} from './states/calendar-actions';
import {setLoading} from './states/loading-actions.js';

import {StyleProvider, Container, Header, Body, Title} from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import Main from './components/Main.js';
import EventForm from './components/EventForm.js';
import FormMap from './components/FormMap.js';
import EventsListScreen from './components/EventsListScreen.js';
import Login from './components/Login.js';
import theme from './theme.js';

const AppNavigator = StackNavigator({
    Main: {screen: Main},
    AddEvent: {screen: EventForm},
    AddEventMap:{screen: FormMap},
    Events: {screen: EventsListScreen},
    Login: {screen: Login}
},
{
  initialRouteName:'Main',
  navigationOptions:{
    headerStyle: {backgroundColor: theme.themeColorDark},
    headerTintColor: theme.themeColorLight
  }
}
);

class AppWithLoading extends React.Component {
  render() {
    if(this.props.loading)
        return(
            <View
              style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
                <View style={{height:"60%", width:"100%"}}/>
                <View style={{height:"40%", width:"100%", alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize:16,
                      color: theme.themeColorLight,
                    }}>Loading...{"\n"}</Text>
                    <ProgressBarAndroid style={{width:"70%"}} color={theme.themeColorLight} styleAttr={"Horizontal"} />
                </View>
            </View>
        );
      return (
          <AppWithNavState />
      );
  }
}
const AppWithLoadingState = connect(state => ({
    loading: state.loading.loading
}))(AppWithLoading);

class AppWithStyleAndNavigator extends React.Component {
    render() {
        return (
            <Container>
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
            this.props.dispatch(NavigationActions.back());
            return true;
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }
}

const AppWithNavState = connect(state => ({
    nav: state.nav,
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
    nav,
    loading
}),
undefined,
compose(applyMiddleware(thunkMiddleware, loggerMiddleware), autoRehydrate()));

export default class App extends React.Component {
    constructor(props){
        super(props);
        persistStore(store, {
          storage: AsyncStorage,
          blacklist: [nav, loading]
        }, () => {
            store.dispatch(initCalendar());
            store.dispatch(setLoading(false));
        });
    }
    render() {
        return (
            <Provider store={store}>
                <StyleProvider style={getTheme(platform)}>
                    <AppWithLoadingState />
                </StyleProvider>
            </Provider>
        );
    }
}
