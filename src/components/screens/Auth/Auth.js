import React, { Component } from 'react';
import { View, Dimensions,
  StyleSheet, ImageBackground,
  KeyboardAvoidingView, Keyboard,
  TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import DefaultInput from '../../UI/DefaultInput/DefaultInput';
import HeadingText from '../../UI/HeadingText/HeadingText';
import MainText from '../../UI/MainText/MainText';
import ButtonWithBackground
  from '../../UI/ButtonWithBackground/ButtonWithBackground';

import validate from '../../../utility/validation';
import { tryAuth } from '../../store/actions/index';

import backgroundImage from '../../../assets/background.jpg';

class AuthScreen extends Component {
  state = {
    viewMode: Dimensions.get('window').height > 500 ?
      'portrait' : 'landscape',
    authMode: 'login',
    controls: {
      email: {
        value: '',
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: '',
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched: false
      },
      confirmPassword: {
        value: '',
        valid: false,
        validationRules: {
          equalTo: 'password'
        },
        touched: false
      }
    }
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

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        authMode: prevState.authMode === 'login' ? 'signup' : 'login'
      }
    })
  }

  authHandler = () => {
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    this.props.onTryAuth(authData, this.state.authMode);
  }

  updateInputState = (key, value) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControls = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControls].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      }
    }
    if (key === 'password') {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      }
    }

    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid: key === 'password' ?
              validate(prevState.controls.confirmPassword.value,
                prevState.controls.confirmPassword.validationRules,
                connectedValue)
              :
              prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            valid: validate(value,
              prevState.controls[key].validationRules,
              connectedValue
            ),
            touched: true
          }
        }
      };
    });
  }

  render() {
    let headingText = null;
    let confirmPasswordControl = null;
    let submitButton = (
      <ButtonWithBackground color='#29aaf4'
        onPress={this.authHandler}
        disabled={
          !this.state.controls.confirmPassword.valid
            && this.state.authMode === 'signup' ||
          !this.state.controls.email.valid ||
          !this.state.controls.password.valid
        }>
          Submit
      </ButtonWithBackground>
    );

    if (this.state.viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeadingText>Please Log In</HeadingText>
        </MainText>
      );
    }
    if (this.state.authMode === 'signup') {
      confirmPasswordControl = (
        <View
          style={this.state.viewMode === 'portrait' ?
            styles.portraitPasswordWrapper :
            styles.landscapePasswordWrapper}>
          <DefaultInput placeholder='Confirm Password'
            style={styles.input}
            value={this.state.controls.confirmPassword.value}
            valid={this.state.controls.confirmPassword.valid}
            touched={this.state.controls.confirmPassword.touched}
            secureTextEntry
            onChangeText={(val) => this.updateInputState(
              'confirmPassword', val)}/>
        </View>
      );
    }

    if (this.props.isLoading) {
      submitButton = <ActivityIndicator/>;
    }

    return (
      <ImageBackground source={backgroundImage}
          style={styles.backgroundImage}>
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        {headingText}
        <ButtonWithBackground color='#29aaf4'
          onPress={this.switchAuthModeHandler}>
            Switch to {this.state.authMode ===
              'login' ? 'Sign Up' : 'Login'}
        </ButtonWithBackground>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            {/* onChangeText has value: val */}
            <DefaultInput placeholder='Your Email Address'
              style={styles.input}
              value={this.state.controls.email.value}
              valid={this.state.controls.email.valid}
              touched={this.state.controls.email.touched}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
              onChangeText={(val) => this.updateInputState('email', val)}/>
            <View
              style={this.state.viewMode === 'portrait' ||
                this.state.authMode === 'login'?
                styles.portraitPasswordContainer :
                styles.landscapePasswordContainer}>
              <View
                style={this.state.viewMode === 'portrait' ||
                  this.state.authMode === 'login' ?
                  styles.portraitPasswordWrapper :
                  styles.landscapePasswordWrapper}>
                <DefaultInput placeholder='Password'
                  style={styles.input}
                  valid={this.state.controls.password.valid}
                  value={this.state.controls.password.value}
                  touched={this.state.controls.password.touched}
                  secureTextEntry
                  onChangeText={(val) => this.updateInputState('password', val)}/>
              </View>
              {confirmPasswordControl}
            </View>
          </View>
          </TouchableWithoutFeedback>
          {submitButton}
        </KeyboardAvoidingView>
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

const mapDispatchToProps = dispatch => {
  return {
    onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode))
  };
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
