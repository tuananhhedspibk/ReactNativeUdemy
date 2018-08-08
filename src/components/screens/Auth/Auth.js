import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, ImageBackground } from 'react-native';

import startMainTabs from '../MainTabs/startMainTabs';
import DefaultInput from '../../UI/DefaultInput/DefaultInput';
import HeadingText from '../../UI/HeadingText/HeadingText';
import MainText from '../../UI/MainText/MainText';
import ButtonWithBackground
  from '../../UI/ButtonWithBackground/ButtonWithBackground';

import backgroundImage from '../../../assets/background.jpg';

class AuthScreen extends Component {
  state = {
    viewMode: Dimensions.get('window').height > 500 ?
      'portrait' : 'landscape'
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener('change', this.updateStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles);
  }

  updateStyles = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ?
        'portrait' : 'landscape'
    });
  }

  loginHandler = () => {
    startMainTabs();
  }

  render() {
    let headingText = null;

    if (this.state.viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeadingText>Please Log In</HeadingText>
        </MainText>
      );
    }
    return (
      <ImageBackground source={backgroundImage}
          style={styles.backgroundImage}>
      <View style={styles.container}>
        {headingText}
        <ButtonWithBackground color='#29aaf4'
          onPress={() => alert('Hello')}>
            Switch to Login
        </ButtonWithBackground>
        <View style={styles.inputContainer}>
          <DefaultInput placeholder='Your Email Address'
            style={styles.input}/>
          <View
            style={this.state.viewMode === 'portrait' ?
              styles.portraitPasswordContainer :
              styles.landscapePasswordContainer}>
            <View
              style={this.state.viewMode === 'portrait' ?
                styles.portraitPasswordWrapper :
                styles.landscapePasswordWrapper}>
              <DefaultInput placeholder='Password'
                style={styles.input}/>
            </View>
            <View
              style={this.state.viewMode === 'portrait' ?
                styles.portraitPasswordWrapper :
                styles.landscapePasswordWrapper}>
              <DefaultInput placeholder='Confirm Password'
                style={styles.input}/>
            </View>
          </View>
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
  },
  landscapePasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  portraitPasswordContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  landscapePasswordWrapper: {
    width: '45%'
  },
  portraitPasswordWrapper: {
    width: '100%'
  }
});

export default AuthScreen;
