// App component will connect to redux store
// App component will use Redux store's state, dispatch like its props

import { Navigation } from 'react-native-navigation';

import AuthScreen from './src/components/screens/Auth/Auth';

// Register screen
Navigation.registerComponent('awesome-places.AuthScreen', () => AuthScreen)

// Start an App
Navigation.startSingleScreenApp({
  screen: {
    screen: 'awesome-places.AuthScreen',
    title: 'Login'
  }
});
