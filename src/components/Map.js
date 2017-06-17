import React, { Component, View, Text } from 'react';
import {
  StyleSheet
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {connect} from 'react-redux';
import {setPinPosition} from '../states/map-actions.js';

class Map extends Component {
    constructor(props){
        super(props);
        Mapbox.setAccessToken(this.props.accessToken);
        this.map = null;
        this.state = {
            annotations: [{
                coordinates: [91, 181],
                type: 'point',
                annotationImage: {
                  source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
                  height: 25,
                  width: 25
                },
                id: 'pinMarker'
            }]
        }
    }

    render() {
        return (
            <MapView
                style={styles.map}
                ref={(map) => {this.map = map;}}
                initialZoomLevel={14}
                initialCenterCoordinate={{latitude: 120.9917471227813, longitude: 24.79567369463787}}
                rotateEnabled={this.props.pinable}
                scrollEnabled={this.props.pinable}
                zoomEnabled={this.props.pinable}
                pitchEnabled={this.props.pinable}
                showsUserLocation={true}
                userTrackingMode={Mapbox.userTrackingMode.follow}
                logoIsHidden={true}
                onTap={this.props.pinable?(e) => this.onTap(e):null}
                annotations={this.props.pinable?this.state.annotations:[]}
            />
        );
    }

    onTap(e){
        this.props.dispatch(setPinPosition({latitude: e.latitude, longitude: e.longitude}));
        this.setState({
            annotations: [{
                coordinates: [e.latitude, e.longitude],
                type: 'point',
                annotationImage: {
                  source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
                  height: 25,
                  width: 25
                },
                id: 'pinMarker'
            }]
        });
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
