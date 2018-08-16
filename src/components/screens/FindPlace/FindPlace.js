import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet,
  Text, Animated } from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../PlaceList/PlaceList';
import { getPlaces } from '../../store/actions/index';

class FindPlaceScreen extends Component {
  static navigatorStyle = {
    navBarButtonColor: 'orange'
  }

  state = {
    placesLoaded: false,
    removeAnim: new Animated.Value(1),
    placeAnim: new Animated.Value(0)
  }

  // Animated.Value(value of opacity and scale (init value))

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    this.props.onLoadPlaces();
  }

  onNavigatorEvent = event => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'sideDrawerToggle') {
        this.props.navigator.toggleDrawer({
          side: 'left'
        })
      }
    }
  }

  itemSelectedHandler = key => {
    const selPlace = this.props.places.find(place => {
      return place.key === key
    });
    this.props.navigator.push({
      screen: 'awesome-places.PlaceDetailScreen',
      title: selPlace.name,
      passProps: {
        selectedPlace: selPlace
      }
    })
  }

  placeLoadHandler = () => {
    Animated.timing(this.state.placeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }

  placeSearchHandler = () => {
    // toValue: the destination value of Animated.Value
    // timing: define the time that animation will occur
    // useNativeDirver for improve the performance of animation
    // by use native
    // pass a function to start()
    // that function will be executed after animation end

    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        placesLoaded: true
      });
      this.placeLoadHandler();
    });
  }

  render() {
    let content = (
      <Animated.View style={{
        opacity: this.state.removeAnim,
        transform: [
          {
            scale: this.state.removeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 1]
            })
          }
        ]
      }}>
        <TouchableOpacity onPress={this.placeSearchHandler}>
          <View style={styles.searchButton}>
            <Text style={styles.searchButtonText}>
              Find Place
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );

    if (this.state.placesLoaded) {
      content = (
        <Animated.View style={{
          opacity: this.state.placeAnim
        }}>
          <PlaceList places={this.props.places}
            onItemSelected={this.itemSelectedHandler}/>
        </Animated.View>
      );
    }

    return (
      <View style={this.state.placesLoaded ?
        null : styles.buttonContainer}>
          {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchButton: {
    borderColor: 'orange',
    borderWidth: 3,
    borderRadius: 50,
    padding: 20
  },
  searchButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 20
  }
});

const mapStateToProps = state => {
  return {
    places: state.places.places
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadPlaces: () => dispatch(getPlaces())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);
