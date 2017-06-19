import moment from 'moment';
import {initMap} from './map-actions.js'
import {getDirection as getDirectionFormAPI} from '../api/mapboxAPI.js';
import {getEvent as getEventFromAPI, addEvent as addEventFormAPI, getNextEvent as getNextEventFormAPI, getDay as getDayFormAPI, getMonth as getMonthFormAPI} from '../api/calendarAPI.js';

export function initCalendar() {
    return (dispatch) => {
        dispatch(getEvents());
        dispatch(getDayEvents());
        return dispatch(initMap()).then(() => {
            dispatch(getNextEvent());
        }).
            then(() => {
                dispatch(updateLeaveTimeStart());
            });
    };
}

function getEventsStart() {
    return {type: '@CALENDAR/GET_EVENTS_START'};
}
function getEventsEnd(events) {
    return {type: '@CALENDAR/GET_EVENTS_END', events};
}

export function getEvents() {
    return (dispatch, getState) => {
        dispatch(getEventsStart());
        return getEventFromAPI(getState().calendar.userId).then((data) => {
            dispatch(getEventsEnd(data));
        }).
            catch((err) => {
                console.error("Can't get events from server"  + err.message);
            });
    };
}

export function addEventStart() {
    return {type: '@CALENDAR/ADD_EVENT_START'};
}
export function addEventEnd(event) {
    return {type: '@CALENDAR/ADD_EVENT_END', event};
}

export function addEvent(event) {
    return (dispatch, getState) => {
        event.userId = getState().calendar.userId;
        dispatch(addEventStart());
        return addEventFormAPI(event).then((data) => {
            dispatch(addEventEnd(data));
            dispatch(getNextEvent());
            dispatch(getDayEvents());
        }).
        catch((err) => {
            console.error("Can't add event to server"  + err.message);
        });
    };
}

export function setEvent(id, key, value) {
    return {type: '@CALENDAR/SET_EVENT', id, key, value};
}

function getNextEventStart() {
    return {type: '@CALENDAR/GET_NEXT_EVENT_START'};
}

function getNextEventEnd(event) {
    return {type: '@CALENDAR/GET_NEXT_EVENT_END', event};
}

export function getNextEvent() {
    return (dispatch, getState) => {
        dispatch(getNextEventStart());
        return getNextEventFormAPI(getState().calendar.userId).then((data) => {
            dispatch(getNextEventEnd(data));
            dispatch(updateNextEvent());
        }).
        catch((err) => {
            console.error("Can't get next event" + err.message);
        });
    };
}

function updateNextEventStart() {
    return {type: '@CALENDAR/UPDATE_NEXT_EVENT_START'};
}

function updateNextEventEnd(event) {
    return {type: '@CALENDAR/UPDATE_NEXT_EVENT_END', event};
}

export function updateNextEvent() {
    return (dispatch, getState) => {
        if (!getState().calendar.nextEvent)
            return;
        dispatch(updateNextEventStart());
        let {lng, lat, trans} = getState().calendar.nextEvent;
        if (!lng || !lat || !trans || !getState().map.currentPosition)
            return;
        return getDirectionFormAPI(
            getState().map.currentPosition.longitude,
            getState().map.currentPosition.latitude,
            lng,
            lat,
            trans,
            getState().map.accessToken).
            then((data) => {
                let event = JSON.parse(JSON.stringify(getState().calendar.nextEvent));
                event.duration = data.duration;
                event.distance = data.distance;
                dispatch(updateNextEventEnd(event));
            }).
            catch(error => {
                console.error(error.message);
            });
    };
}

function getDayEventsStart() {
    return {type: '@CALENDAR/GET_DAY_EVENTS_START'};
}

function getDayEventsEnd(events) {
    return {type: '@CALENDAR/GET_DAY_EVENTS_END', events};
}

export function getDayEvents() {
    return (dispatch, getState) => {
        dispatch(getDayEventsStart());
        let {userId, pickedDay} = getState().calendar;
        return getDayFormAPI(userId, moment(pickedDay).year(), moment(pickedDay).month() + 1, moment(pickedDay).date()).then((data) => {
            dispatch(getDayEventsEnd(data));
        }).
        catch((err) => {
            console.error("Can't get day events" + err.message);
        });
    };
}

function setPickedDayAction(pickedDay) {
    return {type: '@CALENDAR/SET_PICKED_DAY', pickedDay};
}

export function setDay(day) {
    return (dispatch, getState) => {
        dispatch(setPickedDayAction(day));
        return dispatch(getDayEvents());
    };
}

function setLeaveTime() {
    return {
        type: '@CALENDAR/SET_LEAVE_TIME'
    };
}

function setLeaveTimeId(id){
    return {
        type: '@CALENDAR/SET_LEAVE_TIME_ID',
        id
    };
}

export function updateLeaveTimeStart() {
    return (dispatch) => {
        dispatch(setLeaveTime());
        let id = setInterval(() => {
            dispatch(setLeaveTime());
        }, 60000);
        dispatch(setLeaveTimeId(id));
    };
}

function clearLeaveTimeAction(){
    return {
        type: '@CALENDAR/CLEAR_LEAVE_TIME'
    };
}

export function clearLeaveTime() {
    return (dispatch, getState) => {
        clearInterval(getState().calendar.leaveTimeId);
        dispatch(clearLeaveTimeAction());
    };
}
export function setBackground(back){
    return {
        type: '@CALENDAR/SET_BACK',
        back
    };
}
export function setNotify(notified){
    return {
        type: '@CALENDAR/SET_NOTIFIED',
        notified
    };
}
export function setUserId(id){
    return {
        type: '@CALENDAR/SET_USER_ID',
        id
    }
}
