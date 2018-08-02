import React, { Component } from 'react';
import { View, Button, StyleSheet, ImageBackground } from 'react-native';

import startMainTabs from '../MainTabs/startMainTabs';
import DefaultInput from '../../UI/DefaultInput/DefaultInput';
import HeadingText from '../../UI/HeadingText/HeadingText';
import MainText from '../../UI/MainText/MainText';
import ButtonWithBackground
  from '../../UI/ButtonWithBackground/ButtonWithBackground';

import backgroundImage from '../../../assets/background.jpg';

class AuthScreen extends Component {
  loginHandler = () => {
    startMainTabs();
  }

  render() {
    return (
      <ImageBackground source={backgroundImage}
          style={styles.backgroundImage}>
      <View style={styles.container}>
          <MainText>
            <HeadingText>Please Log In</HeadingText>
          </MainText>
          <ButtonWithBackground color='#29aaf4'
            onPress={() => alert('Hello')}>
              Switch to Login
          </ButtonWithBackground>
          <View style={styles.inputContainer}>
            <DefaultInput placeholder='Your Email Address'
              style={styles.input}/>
            <DefaultInput placeholder='Password'
              style={styles.input}/>
            <DefaultInput placeholder='Confirm Password'
              style={styles.input}/>
          </View>
          <ButtonWithBackground color='#29aaf4'
            onPress={this.loginHandler}>
              Submit
          </ButtonWithBackground>
      </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#bbb'
  },
  backgroundImage: {
    width: '100%',
    flex: 1
  }
});

export default AuthScreen;
