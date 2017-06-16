const initMapState = {
    accessToken: '',
    currentPosition: null, //{lng, lat}
    watchID: null,
    pinPosition: null //{lng, lat}
};

export function map(state = initMapState, action) {
    switch (action.type) {
    case '@MAP/GET_ACCESS_TOKEN_START':
        return{
            ...state
        };
    case '@MAP/GET_ACCESS_TOKEN_END':
        return{
            ...state,
            accessToken: action.token
        };
    case '@MAP/GET_CURRENT_POSITION_START':
        return{
            ...state
        };
    case '@MAP/GET_CURRENT_POSITION_END':
        return {
            ...state,
            currentPosition: action.lngLat
        };
    case '@MAP/UPDATE_CURRENT_POSITION':
        return {
            ...state,
            currentPosition: action.lngLat
        };
    case '@MAP/WATCH_CURRENT_POSITION_START':
        return {
            ...state,
            watchID: action.watchID
        };
    case '@MAP/WATCH_CURRENT_POSITION_END':
        return {
            ...state
        };
    case '@MAP/SET_PIN_POSITION':
        return{
            ...state,
            pinPosition: action.lngLat
        };
    default:
        return state;
    }
}
