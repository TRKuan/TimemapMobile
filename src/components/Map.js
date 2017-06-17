import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {connect} from 'react-redux';

class Map extends Component {
    constructor(props){
        super(props);
        Mapbox.setAccessToken(this.props.accessToken);
        this.map = null;
    }

    render() {
        return (
            <MapView
                style={styles.map}
                ref={(map) => {this.map = map;}}
                initialZoomLevel={14}
                initialCenterCoordinate={{latitude: 120.9917471227813, longitude: 24.79567369463787}}
                rotateEnabled={false}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                showsUserLocation={true}
                userTrackingMode={Mapbox.userTrackingMode.follow}
                logoIsHidden={true}
            />
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
