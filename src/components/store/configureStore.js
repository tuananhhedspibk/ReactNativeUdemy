import { createStore,
  combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

import placesReducer from './reducers/places';
import uiReducer from './reducers/ui';
import authReducer from './reducers/auth';

const rootReducer = combineReducers({
  places: placesReducer,
  ui: uiReducer,
  auth: authReducer
});

// Use compose function to add middleware to store

let composeEnhancers = compose;

// __DEV__ is global variable which only use in development mode

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
