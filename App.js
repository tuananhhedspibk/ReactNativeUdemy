import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import PlaceInput from './src/components/PlaceInput/PlaceInput';
import PlaceList from './src/components/PlaceList/PlaceList';
import PlaceDetail from './src/components/PlaceDetail/PlaceDetail';
import { addPlace, selectPlace, deletePlace, deselectPlace }
  from './src/components/store/actions/index';

class App extends React.Component {
  placeAddHandler = placeName => {
    this.props.onAddPlace(placeName);
  }

  placeSelectedHandler = key => {
    this.props.onSelectPlace(key);
  }

  placeDeletedHandler = () => {
    this.props.onDeletePlace();
  }

  modalClosedHandler = () => {
    this.props.onDeselectPlace();
  }

  render() {
    return (
      <View style={styles.container}>
        <PlaceDetail
          onItemDeleted={this.placeDeletedHandler}
          onModalClosed={this.modalClosedHandler}
          selectedPlace={this.props.selectedPlace}/>
        <PlaceInput onPlaceAdded={this.placeAddHandler}/>
        <PlaceList places={this.props.places}
          onItemSelected={this.placeSelectedHandler}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});

const mapStateToProps = state => {
  return {
    places: state.places.places,
    selectedPlace: state.places.selectedPlace
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (name) => dispatch(addPlace(name)),
    onDeletePlace: () => dispatch(deletePlace()),
    onSelectPlace: (key) => dispatch(selectPlace(key)),
    onDeselectPlace: () => dispatch(deselectPlace())
  };
}

// App component will connect to redux store
// App component will use Redux store's state, dispatch like its props

export default connect(mapStateToProps, mapDispatchToProps)(App);
