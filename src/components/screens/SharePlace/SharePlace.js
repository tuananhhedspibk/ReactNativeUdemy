import React, { Component } from 'react';
import { View, Text, Image,
  Button, StyleSheet, ScrollView } from 'react-native';

import PlaceInput from '../../PlaceInput/PlaceInput';
import MainText from '../../UI/MainText/MainText';
import HeadingText from '../../UI/HeadingText/HeadingText';
import PickImage from '../../PickImage/PickImage';
import PickLocation from '../../PickLocation/PickLocation';

import { connect } from 'react-redux';
import { addPlace } from '../../store/actions/index';


class SharePlaceScreen extends Component {
  static navigatorStyle = {
    navBarButtonColor: 'orange'
  }

  state = {
    placeName: ''
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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

  placeNameChangeHandler = val => {
    this.setState({placeName: val});
  }

  placeAddHandler = () => {
    if(this.state.placeName.trim() !== '') {
      this.props.onAddPlace(this.state.placeName);
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share Place With Us!</HeadingText>
          </MainText>
          <PickImage/>
          <PickLocation/>
          <PlaceInput placeName={this.state.placeName}
            onChangeText={this.placeNameChangeHandler}/>
          <View style={styles.button}>
            <Button title='Share the Place!'
              onPress={this.placeAddHandler}/>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  placeholder: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '80%',
    height: 150
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: '100%',
    height: '100%'
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: placeName => dispatch(addPlace(placeName))
  }
}

export default connect(null, mapDispatchToProps)(SharePlaceScreen);
