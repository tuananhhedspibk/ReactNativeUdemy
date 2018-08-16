import { TRY_AUTH } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

import startMainTabs from '../../screens/MainTabs/startMainTabs';

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    if (authMode === 'login') {

    }
    else {
      dispatch(authSignup(authData));
    }
  }
}

export const authSignup = authData => {
  return dispatch => {
    dispatch(uiStartLoading());
    fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyC1uIPKATULeimRNu-EJ-aEDF2QboFhrck', {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(err => {
      console.log(err);
      alert('Authentication failed, please try again !!');
      dispatch(uiStopLoading());
    })
    .then(res => res.json())
    .then(parsedRes => {
      dispatch(uiStopLoading());
      if (parsedRes.error) {
        alert('Authentication failed, please try again !!');
      }
      else {
        startMainTabs();
      }
    })
  }
};
