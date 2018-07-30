import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';

class PlaceInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeName: ''
    }
  }

  placeSubmitHandler = () => {
    if (this.state.placeName.trim() === ''){
      return;
    }
    this.props.onPlaceAdded(this.state.placeName);
  }

  placeNameChangeHandler = val => {
    this.setState({placeName: val});
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.placeInput}
          value={this.state.placeName}
          placeholder='An awesome place'
          onChangeText={this.placeNameChangeHandler}/>
        <Button title='Add' style={styles.placeButton}
          onPress={this.placeSubmitHandler}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  placeInput: {
    width: '70%'
  },
  placeButton: {
    width: '30%'
  }
});

export default PlaceInput;
