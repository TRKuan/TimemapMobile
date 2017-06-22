import moment from 'moment';
import {initMap} from './map-actions.js'
import {getDirection as getDirectionFormAPI} from '../api/mapboxAPI.js';
import {getEvent as getEventFromAPI, addEvent as addEventFormAPI, getNextEvent as getNextEventFormAPI, getDay as getDayFormAPI, getMonth as getMonthFormAPI, deleteEvent as deleteEventFromAPI} from '../api/calendarAPI.js';

export function initCalendar() {
    return (dispatch) => {
        dispatch(getEvents());
        dispatch(getDayEvents());
        return dispatch(initMap()).then(() => {
            dispatch(getNextEvent());
        }).then(() => {
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
            dispatch(calculateMonthHasEvent());
        }).
            catch((err) => {
                console.error("Can't get events from server", err.message);
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
            dispatch(calculateMonthHasEvent());
        }).
        catch((err) => {
            console.error("Can't add event to server", err.message);
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
            console.error("Can't get next event", err.message);
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
        dispatch(setGetDayLoading(true));
        let {userId, pickedDay} = getState().calendar;
        return getDayFormAPI(userId, moment(pickedDay).year(), moment(pickedDay).month() + 1, moment(pickedDay).date()).then((data) => {
            dispatch(setGetDayLoading(false));
            dispatch(getDayEventsEnd(data));
        }).
        catch((err) => {
            dispatch(setGetDayLoading(false));
            console.error("Can't get day events", err.message);
        });
    };
}

function setPickedDayAction(pickedDay) {
    return {type: '@CALENDAR/SET_PICKED_DAY', pickedDay};
}

function setMonthHasEvent(hasEvent){
    return {type: '@CALENDAR/SET_MONTH_HAS_EVENT', hasEvent};
}

export function calculateMonthHasEvent() {
    return (dispatch, getState) => {
        let hasEvent = {};
        for(let event of getState().calendar.events){
            let time = moment(event.startTs);
            let end = moment(event.endTs);
            hasEvent[`${time.format("YYYY-MM-DD")}`] = {marked: true};
            hasEvent[`${end.format("YYYY-MM-DD")}`] = {marked: true};
            while(time.date()!==end.date()||time.month()!==end.month()||time.year()!==end.year()){
                hasEvent[`${time.format("YYYY-MM-DD")}`] = {marked: true};
                time.add(1, 'day');
            }
            hasEvent[`${moment().format("YYYY-MM-DD")}`] = {selected: true};
        }
        dispatch(setMonthHasEvent(hasEvent));
    };
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
        dispatch(clearLeaveTime());
        dispatch(setLeaveTime());
        let id = setInterval(() => {
            dispatch(setLeaveTime());
        }, 1000);
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

function deleteEventStart() {
    return {type: '@CALENDAR/DELETE_EVENT_START'};
}

function deleteEventEnd() {
    return {type: '@CALENDAR/DELETE_EVENT_END'};
}

export function deleteEvent(eventId, day) {
    return (dispatch, getState) => {
        dispatch(deleteEventStart());
        let {userId} = getState().calendar;
        return deleteEventFromAPI(userId, eventId).then(() => {
            dispatch(setDay(day));
            dispatch(deleteEventEnd());
            dispatch(initCalendar());
        }).
        catch((err) => {
            console.error("Can't delete event.", err.message);
        });
    };
}

export function resetCalendar(){
    return {type: '@CALENDAR/RESET_CALENDAR'};
}

export function setUser(user){
    return {
      type: '@CALENDAR/SET_USER',
      user
    };
}

function setGetDayLoading(loading){
    return {
      type: '@CALENDAR/SET_GET_DAY_LOADING',
      loading
    }
}
