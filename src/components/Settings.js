import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Linking,
  Text,
  View,
} from 'react-native';

import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import {connect} from 'react-redux';
import {setUserId, initCalendar, setUser, resetCalendar} from '../states/calendar-actions';

import theme from '../theme.js';

class Settings extends Component {
  static navigationOptions = {
    tabBarLabel: 'Settings'
  };

//=================================================================
//if you have some trouble, you can try delete the code belong


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

      this.props.dispatch(setUserId(JSON.parse(decodeURI(user_string)).id));
      this.props.dispatch(setUser(JSON.parse(decodeURI(user_string))));
      this.props.dispatch(initCalendar());
      if(this.props.onUserIdChanged){
        this.props.onUserIdChanged(JSON.parse(decodeURI(user_string)).id);
      }

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
    this.props.dispatch(setUser({id: "no user"}));
    this.props.dispatch(resetCalendar());
    if(this.props.onUserIdChanged)
      this.props.onUserIdChanged("no user");
  });

  // Open URL in a browser
  openURL = (url) => {
      Linking.openURL(url);
  };

//=============================================================================

  render() {
    const { user } = this.props;

    if(!user||user.id==='no user'){
      return(
        <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
          <View style={styles.topPanelBefore}>
              <Image
                source={require('../images/logo512.png')}
                style={styles.logoImage}
              />
              <Text style={styles.logoText}>TimeMap</Text>
          </View>
          <View style={styles.bottomPanelBefore}>
            <Button
              bordered
              iconLeft
              onPress={this.loginWithFacebook}
              style={{borderRadius: 15, borderWidth: 1.5, borderColor:　'#486bb5'/*theme.themeColorDark*//*Light*/, alignSelf: 'center', marginTop: 40}}
            >
              <Icon name="facebook" style={{color: '#486bb5'}}/>
              <Text style={{color: '#486bb5'/*'#888'*//*theme.themeColorLight*/, marginLeft: 10}}>Sign in with Facebook</Text>
            </Button>
            <Button
              bordered
              iconLeft
              onPress={this.loginWithGoogle}
              style={{borderRadius: 15, borderWidth: 1.5, borderColor:　'#4285f4'/*theme.themeColorDark*//*Light*/, alignSelf: 'center', marginTop: 15}}
            >
              <Icon name="google" style={{color: '#4285f4'}}/>
              <Text style={{color: '#4285f4'/*'#888'*//*theme.themeColorDarkLight*/, marginLeft: 10}}>Sign in with Google</Text>
            </Button>
          </View>
          <View style={styles.footer}>
            <Text style={styles.slogan}>Map Your Time. Map Your Life.</Text>
          </View>
      </View>

      );
    }else {
      if(user.source === "Facebook"){
        return(
          <View style={{flex: 1, backgroundColor: theme.themeColorDark}}>
            <View style={styles.topPanelAfter}>
              <Text style={styles.header}>
                Welcome,
              </Text>
              <View style={styles.avatar}>
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              </View>
              <Text style={styles.userName}>
                {user.name}!
              </Text>
            </View>
            <View style={styles.bottomPanelAfter}>
              <Button
                bordered
                iconLeft
                onPress={this.logout}
                style={{borderRadius: 15, borderWidth: 1.5, borderColor:　'#486bb5'/*theme.themeColorDark*//*Light*/, alignSelf: 'center', marginTop: 40}}
              >
                <Icon name="facebook" style={{color: '#486bb5'}}/>
                <Text style={{color: '#486bb5'/*'#888'*//*theme.themeColorLight*/, marginLeft: 10}}>Logout of Facebook</Text>
              </Button>
            </View>
            <View style={styles.footer}>
              <Text style={styles.slogan}>Map Your Time. Map Your Life.</Text>
            </View>
        </View>
        )
      }else {
        //if you have trouble about user's image, delete "+'0'" .
        return(
          <View style={{flex: 1, backgroundColor: theme.themeColorDark}}>
            <View style={styles.topPanelAfter}>
                <Text style={styles.header}>
                  Welcome,
                </Text>
                <View style={styles.avatar}>
                  <Image source={{ uri: user.avatar+'0' }} style={styles.avatarImage} />
                </View>
                <Text style={styles.userName}>
                  {user.name}!
                </Text>
            </View>
            <View style={styles.bottomPanelAfter}>
              <Button
                bordered
                iconLeft
                onPress={this.logout}
                style={{borderRadius: 15, borderWidth: 1.5, borderColor:　'#4285f4'/*theme.themeColorDark*//*Light*/, alignSelf: 'center', marginTop: 40}}
              >
                <Icon name="google" style={{color: '#4285f4'}}/>
                <Text style={{color: '#4285f4'/*'#888'*//*theme.themeColorLight*/, marginLeft: 10}}>Logout of Google</Text>
              </Button>
            </View>
            <View style={styles.footer}>
              <Text style={styles.slogan}>Map Your Time. Map Your Life.</Text>
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
  avatar: {
    margin: 20,
    justifyContent: 'center'
  },
  avatarImage: {
    borderRadius: 64,
    height: 128,
    width: 128,
    alignSelf: 'center'
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
  },
  userName: {
    fontSize: 30,
    alignSelf: 'center',

  },
  topPanelBefore: {
    height: '60%',
    justifyContent: 'center',
    backgroundColor: theme.themeColorDark,

  },
  bottomPanelBefore: {
    height: '30%',
    justifyContent: 'center',
  },
  footer: {
    height: '10%',

    justifyContent: 'center'
  },
  logoImage: {
    width: 128,
    height: 128,
    alignSelf: 'center',
  },
  logoText: {
    color: theme.themeColorLight,
    fontSize: 24,
    marginTop: 10,
    alignSelf: 'center',

  },
  slogan: {
    alignSelf: 'center',
    color: '#aaa',
    marginTop: 10
  },
  btns: {
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor:　theme.themeColorLight,
    alignSelf: 'center'
  },
  topPanelAfter: {
    height: '60%',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',

  },
  bottomPanelAfter: {
    height: '30%',
    justifyContent: 'center',
    backgroundColor: theme.themeColorDark,
  },
});
export default connect((state, ownProps) => ({
    user: state.calendar.user
}))(Settings);
