import { AsyncStorage } from 'react-native';

import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

import startMainTabs from '../../screens/MainTabs/startMainTabs';

import App from '../../../../App';

const API_KEY = 'AIzaSyC1uIPKATULeimRNu-EJ-aEDF2QboFhrck';

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY;
    if (authMode === 'signup') {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + API_KEY;
    }
    fetch(url, {
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
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      else {
        throw new Error();
      }
    })
    .then(parsedRes => {
      dispatch(uiStopLoading());
      if (!parsedRes.idToken) {
        alert('Authentication failed, please try again !!');
      }
      else {
        dispatch(authStoreToken(
          parsedRes.refreshToken,
          parsedRes.idToken,
          parsedRes.expiresIn));
        startMainTabs();
      }
    });
  }
}

export const authStoreToken = (refreshToken ,token, expiresIn) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem('ap:auth:token', token);
    AsyncStorage.setItem('ap:auth:expiryDate', expiryDate.toString());
    AsyncStorage.setItem('ap:auth:refreshToken', refreshToken)
  }
}

export const authSetToken = (token, expiresDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiresDate: expiresDate
  }
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    // getState is the function that get state from redux store
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiresDate = getState().auth.expiryDate;
      console.log(expiresDate)
      if (!token || new Date(expiresDate) <= new Date()) {
        let fetchedToken;
        AsyncStorage.getItem('ap:auth:token')
          .then(tokenFromStorage => {
            fetchedToken = tokenFromStorage;
            if (!tokenFromStorage) {
              reject();
              return;
            }
            return (AsyncStorage.getItem('ap:auth:expiryDate'));
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            }
            else {
              reject();
            }
          })
          .catch(err => {
            reject();
          })
      }
      else {
        resolve(token);
      }
    });
    return promise.catch(err => {
      return AsyncStorage.getItem('ap:auth:refreshToken')
      .then(refreshToken => {
        return fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'grant_type=refresh_token&refresh_token=' + refreshToken
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          throw new Error();
        }
      })
      .then(parsedRes => {
        if (parsedRes.id_token) {
          dispatch(authStoreToken(
            parsedRes.id_token,
            parsedRes.expires_in,
            parsedRes.refresh_token
          ));
          return parsedRes.id_token;
        }
        else {
          dispatch(authClearStorage());
        }
      })
      .catch(err => {
        reject();
        dispatch(authClearStorage());
      });
    })
    .then(token => {
      if (!token) {
        throw new Error();
      }
      else {
        return token;
      }
    })
  }
}

export const authAutoSignin = () => {
  return dispatch => {
    dispatch(authGetToken())
    .then(token => {
      startMainTabs();
    })
    .catch(err => console.log('Failed to fetch token'));
  }
}

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem('ap:auth:token');
    AsyncStorage.removeItem('ap:auth:expiryDate');
    return AsyncStorage.removeItem('ap:auth:refreshToken');
  }
}

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage())
    .then(() => {
      App();
    });
    dispatch(authRemoveToken());
  }
}

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
