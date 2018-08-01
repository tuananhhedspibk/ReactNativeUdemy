// App component will connect to redux store
// App component will use Redux store's state, dispatch like its props

import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import configureStore from './src/components/store/configureStore';

import AuthScreen from './src/components/screens/Auth/Auth';
import SharePlaceScreen
  from './src/components/screens/SharePlace/SharePlace';
import FindPlaceScreen
  from './src/components/screens/FindPlace/FindPlace';
import PlaceDetailScreen
  from './src/components/screens/PlaceDetail/PlaceDetail';
import SideDrawer
  from './src/components/screens/SideDrawer/SideDrawer';

const store = configureStore();

// Register screen (id, generator function)
Navigation.registerComponent('awesome-places.AuthScreen',
  () => AuthScreen, store, Provider);
Navigation.registerComponent('awesome-places.SharePlaceScreen',
  () => SharePlaceScreen, store, Provider);
Navigation.registerComponent('awesome-places.FindPlaceScreen',
  () => FindPlaceScreen, store, Provider);
Navigation.registerComponent('awesome-places.PlaceDetailScreen',
  () => PlaceDetailScreen, store, Provider);
Navigation.registerComponent('awesome-places.SideDrawer',
  () => SideDrawer);

// Start an App
Navigation.startSingleScreenApp({
  screen: {
    screen: 'awesome-places.AuthScreen',
    title: 'Login'
  }
});
