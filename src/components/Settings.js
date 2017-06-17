import React, { Component } from 'react';
import {
  StyleSheet,
  Linking,
  Text,
  View,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Settings extends Component {
  static navigationOptions = {
    tabBarLabel: 'Settings'
  };

//=================================================================
//if you have some trouble, you can try delete the code belong
  state = {
    user: undefined, // user has not logged in yet
  };

  // Set up Linking
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  };

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    this.setState({
      // Decode the user string and parse it into JSON
      user: JSON.parse(decodeURI(user_string))
    });
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
  };

  // Handle Login with Facebook button tap
  loginWithFacebook = () => this.openURL('http://localhost:3000/auth/facebook');

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL('http://10.0.2.2:3000/auth/google');

  // Open URL in a browser
  openURL = (url) => {
      Linking.openURL(url);
  };

//=============================================================================

  render() {
    return (
      <View style={styles.container}>
        <Text>Settings</Text>
        <Icon.Button name="google"
        backgroundColor="#4285f4" title="Login" onPress={this.loginWithGoogle} >
          Login with google
        </Icon.Button>
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
