import { createStore, combineReducers, compose } from 'redux';

import placeReducer from './reducers/places';

const rootReducer = combineReducers({
  places: placeReducer
});

// Use compose function to add middleware to store

let composeEnhancers = compose;

// __DEV__ is global variable which only use in development mode

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
