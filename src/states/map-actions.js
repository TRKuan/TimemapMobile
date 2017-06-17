import {updateNextEvent} from './calendar-actions.js'
import {getAccessToken as getAccessTokenFromAPI} from '../api/mapboxAPI.js';

export function initMap(){
    return (dispatch) => {
        dispatch(getAccessToken());
        return dispatch(getCurrentPosition());
    };
}

function getAccessTokenStart(){
    return {
        type: '@MAP/GET_ACCESS_TOKEN_START'
    };
}

function getAccessTokenEnd(token){
    return {
        type: '@MAP/GET_ACCESS_TOKEN_END',
        token
    };
}

export function getAccessToken() {
    return (dispatch) => {
        dispatch(getAccessTokenStart());
        return getAccessTokenFromAPI().then((data) => {
            dispatch(getAccessTokenEnd(data.token));
            return data.token;
        });
    };
}

function getCurrentPositionStart(){
    return {
        type: '@MAP/GET_CURRENT_POSITION_START',
    };
}

function getCurrentPositionEnd(lngLat) {
    return {
        type: '@MAP/GET_CURRENT_POSITION_END',
        lngLat
    };
}

function updateCurrentPosition(lngLat){
    return {
        type: '@MAP/UPDATE_CURRENT_POSITION',
        lngLat
    };
}

function watchCurrentPositionStart(watchID){
    return {
        type: '@MAP/WATCH_CURRENT_POSITION_START',
        watchID
    };
}

function watchCurrentPositionEnd(){
    return {
        type: '@MAP/WATCH_CURRENT_POSITION_END'
    };
}

function watchCurrentPosition(){
    return (dispatch, getState) => {
        navigator.geolocation.clearWatch(getState().map.watchID);
        let watchID = navigator.geolocation.watchPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            dispatch(updateCurrentPosition({longitude, latitude}));
            dispatch(updateNextEvent());
        }, () => {
            console.error("watchPosition error");
        });
        dispatch(watchCurrentPositionStart(watchID));
    };
}

export function clearWatchPosition(){
    return (dispatch, getState) => {
        navigator.geolocation.clearWatch(getState().map.watchID);
        dispatch(watchCurrentPositionStart(watchCurrentPositionEnd()));
    };
}

export function getCurrentPosition(){
    return (dispatch, getState) => {
        navigator.geolocation.clearWatch(getState().map.watchID);
        dispatch(getCurrentPositionStart());
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                dispatch(getCurrentPositionEnd({longitude, latitude}));
                dispatch(watchCurrentPosition());
                resolve({longitude, latitude});
            }, (error) => reject(error));
        });
    };
}

export function setPinPosition(lngLat) {
    return {
        type: '@MAP/SET_PIN_POSITION',
        lngLat
    };
}
