import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {connect} from 'react-redux';

class Map extends Component {
    constructor(props){
        super(props);
        Mapbox.setAccessToken('pk.eyJ1IjoidHJrdWFuIiwiYSI6ImNqMXlsYnE1ZjAwdHcyeHJxa3lrYWg2dHcifQ.tBkscd-d-S0Z374VcVw3Qg');
    }

    render() {
        return (
            <MapView style={styles.map} />
        );
    }
}

const styles = StyleSheet.create({
  map: {
    height:"100%",
    width:"100%"
  }
});

export default connect((state, ownProps) => ({
    ...state.calendar,
    ...state.map
}))(Map);
