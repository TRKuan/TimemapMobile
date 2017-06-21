import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Linking,
  Text,
  View,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {connect} from 'react-redux';
import {setUserId} from '../states/calendar-actions';

class Settings extends Component {
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
    }, () => {
      this.props.dispatch(setUserId(this.state.id));
    });

    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
  };

  // Handle Login with Facebook button tap
  loginWithFacebook = () => this.openURL('http://timemaploginserver.us-west-2.elasticbeanstalk.com/auth/facebook');

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL('http://timemaploginserver.us-west-2.elasticbeanstalk.com/auth/google');

  logout = () => this.setState({
    user: undefined
  }, () => {
    this.props.dispatch(setUserId("no user"));
  });

  // Open URL in a browser
  openURL = (url) => {
      Linking.openURL(url);
  };

//=============================================================================

  render() {
    const { user } = this.state;
    if(!user){
      return(
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.content}>
              <Text style={styles.header}>
                Welcome Stranger!
              </Text>
              <View style={styles.avatar}>
                <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
              </View>
              <Text style={styles.text}>
                Please log in to continue {'\n'}
                to the awesomness
              </Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <Icon.Button
              name="google"
              backgroundColor="#4285f4"
              title="Login"
              onPress={this.loginWithGoogle}
              {...iconStyles}
            >
              Login with Google
            </Icon.Button>
            <Icon.Button
              name="facebook"
              backgroundColor="#3b5998"
              onPress={this.loginWithFacebook}
              {...iconStyles}
            >
              Login with Facebook
            </Icon.Button>
          </View>
        </View>
      );
    }else {
      if(user.source === "Facebook"){
        return(
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.header}>
                Welcome {user.name}!{'\n'}
                your id {user.id}
              </Text>
              <View style={styles.avatar}>
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              </View>
            </View>
            <View style={styles.buttons}>
              <Icon.Button
              name="facebook"
              backgroundColor="#3b5998"
              onPress={this.logout}
              {...iconStyles}
              >
                Logout with Facebook
              </Icon.Button>
            </View>
          </View>
        )
      }else {
        return(
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.header}>
                Welcome {user.name}!{'\n'}
                your id {user.id}
              </Text>
              <View style={styles.avatar}>
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              </View>
            </View>
            <View style={styles.buttons}>
              <Icon.Button
              name="google"
              backgroundColor="#4285f4"
              onPress={this.logout}
              {...iconStyles}
              >
                Logout with Google
              </Icon.Button>
            </View>
          </View>
        )
      }
    }
  }
}

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 0,
    marginBottom: 30,
    //alignItems: 'center'
  }
});

export default connect((state, ownProps) => ({

}))(SettingsOriginal);
