import React, { Component } from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import Settings from './Settings';


class Login extends Component {
    static navigationOptions = {
      tabBarLabel: 'Log In'
    };

    render() {
        return (
          <Settings onUserIdChanged={(id)=>{
              if(id&&id!=='no user')
                  this.props.dispatch(NavigationActions.navigate({routeName: 'Main'}));
          }}/>
        );
    }
}
export default connect((state, ownProps) => ({
    ...state.calendar,
}))(Login);
