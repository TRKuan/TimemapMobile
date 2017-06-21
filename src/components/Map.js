import React, { Component} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {connect} from 'react-redux';
import {setPinPosition} from '../states/map-actions.js';

class Map extends Component {
    constructor(props){
        super(props);
        Mapbox.setAccessToken(this.props.accessToken);
        this.map = null;
        let annotations = [];
        annotations.push({
            coordinates: [91, 181],
            type: 'point',
            annotationImage: {
              source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
              height: 25,
              width: 25
            },
            id: 'pinMarker'
        });
        annotations.push({
            coordinates: [91, 181],
            type: 'point',
            annotationImage: {
              source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
              height: 25,
              width: 25
            },
            id: 'nextMarker'
        });
        this.state = {
            annotations
        };
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.currentPosition&&nextProps.currentPosition)
            this.map.setCenterCoordinate(nextProps.currentPosition.latitude, nextProps.currentPosition.longitude, false);
        if(this.props.showNextEvent&&nextProps.nextEvent!=this.props.nextEvent){
            this.updateNextEventMarker(nextProps.nextEvent);
        }
        if(this.props.showNextEvent&&this.props.currentPosition&&nextProps.nextEvent&&nextProps.nextEvent!=this.props.nextEvent)
            if(nextProps.nextEvent.lat)
                this.map.setVisibleCoordinateBounds(
                    Math.min(this.props.currentPosition.latitude, nextProps.nextEvent.lat),
                    Math.min(this.props.currentPosition.longitude, nextProps.nextEvent.lng),
                    Math.max(this.props.currentPosition.latitude, nextProps.nextEvent.lat),
                    Math.max(this.props.currentPosition.longitude, nextProps.nextEvent.lng),
                    100,
                    100,
                    100,
                    100
                );

    }

    render() {
        return (
          <View style={this.props.style}>
            <MapView
                style={styles.map}
                ref={(map) => {this.map = map;}}
                initialZoomLevel={14}
                initialCenterCoordinate={{latitude: 24.79567369463787, longitude: 120.9917471227813}}
                rotateEnabled={false}
                scrollEnabled={this.props.pinable}
                zoomEnabled={this.props.pinable}
                pitchEnabled={false}
                showsUserLocation={true}
                userTrackingMode={Mapbox.userTrackingMode.none}
                logoIsHidden={true}
                onTap={this.props.pinable?(e) => this.onTap(e):null}
                annotations={this.state.annotations}
                annotationsAreImmutable={true}
            />
          </View>
        );
    }

    onTap(e){
        this.props.dispatch(setPinPosition({latitude: e.latitude, longitude: e.longitude}));
        this.setPinMarker(e.latitude, e.longitude);
    }

    setPinMarker(latitude, longitude){
        let annotations = this.state.annotations.map((value) => {
            let tmp = JSON.parse(JSON.stringify(value));
            if(value.id === 'pinMarker')
                tmp.coordinates = [latitude, longitude];
            return tmp;
        });
        this.setState({
            annotations
        });
    }

    updateNextEventMarker(nextEvent){
        let annotations = this.state.annotations.map((value) => {
            let tmp = JSON.parse(JSON.stringify(value));
            if(value.id === 'nextMarker'){
                if(nextEvent){
                    if(nextEvent.lat){
                        tmp.coordinates = [nextEvent.lat, nextEvent.lng];
                        return tmp;
                    }
                }
            }
            tmp.coordinates = [91, 181];
            return tmp;
        });
        this.setState({
            annotations
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
