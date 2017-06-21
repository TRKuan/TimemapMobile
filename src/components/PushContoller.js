import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';

export default class PushContoller extends Component{
  componentDidMount(){
      PushNotification.configure({
        onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification );
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
  }
  render(){
    return null;
  }
}
