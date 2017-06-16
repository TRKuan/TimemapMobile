import moment from 'moment';
import {initMap} from './map-actions.js'
import {getDirection as getDirectionFormAPI} from '../api/mapboxAPI.js';
import {addEvent as addEventFormAPI, getNextEvent as getNextEventFormAPI, getDay as getDayFormAPI, getMonth as getMonthFormAPI} from '../api/calendarAPI.js';

export function initCalendar() {
    return (dispatch) => {
        dispatch(getDayEvents());
        dispatch(updateMonth());
        return dispatch(initMap()).then(() => {
            dispatch(getNextEvent());
        }).
        then(() => {
            dispatch(updateLeaveTimeStart());
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
            dispatch(updateMonth());
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
        return getDirectionFormAPI(getState().map.currentPosition, {
            lng,
            lat
        }, trans, getState().map.accessToken).then((data) => {
            let event = JSON.parse(JSON.stringify(getState().calendar.nextEvent));
            event.duration = data.duration;
            event.distance = data.distance;
            dispatch(updateNextEventEnd(event));
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
        return getDayFormAPI(userId, pickedDay.year(), pickedDay.month() + 1, pickedDay.date()).then((data) => {
            dispatch(getDayEventsEnd(data));
        }).
        catch((err) => {
            console.error("Can't get day events" + err.message);
        });
    };
}

function getMonthStart() {
    return {type: '@CALENDAR/GET_MONTH_START'};
}

function getMonthEnd(hasEventList) {
    return {type: '@CALENDAR/GET_MONTH_END', hasEventList};
}

export function getMonth() {
    return (dispatch, getState) => {
        dispatch(getMonthStart());
        let {userId, year, month} = getState().calendar;
        return getMonthFormAPI(userId, year, month).then((data) => {
            dispatch(getMonthEnd(data));
        }).
        catch((err) => {
            console.error("Can't get month" + err.message);
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

function setMonthAction(month) {
    return {type: '@CALENDAR/SET_MONTH', month};
}

export function setMonth(month) {
    return (dispatch, getState) => {
        if (month < 1 || month > 12)
            return;
        dispatch(setMonthAction(month));
        dispatch(updateMonth());
    };
}

function setYearAction(year) {
    return {type: '@CALENDAR/SET_YEAR', year};
}

export function setYear(year) {
    return (dispatch, getState) => {
        dispatch(setYearAction(year));
        dispatch(updateMonth());
    };
}
export function datePicked(cellNum) {
    return {type: '@CALENDAR/PICK_DAY', cellNum};
}

export function updateMonthNumbersCalc(year, month, pickedDay, monthHasEventList) {
    let monthNumbers = [];
    let m = moment({
        year: year,
        month: month - 1,
        date: 1
    });
    let monthPrev = month - 2;
    if (monthPrev < 0) {
        monthPrev = 11;
    }
    let mPrev = moment({year: year, month: monthPrev, date: 1});
    var firstDay = m.day();
    var firstDayPrev = mPrev.daysInMonth() - firstDay;
    let j = 0;
    let k = 0;
    for (let i = 0; i < 42; i++) {
        monthNumbers[i] = {
            isToday: false,
            isPickedDay: false,
            hasEvent: false
        };
        if (i < firstDay) {
            monthNumbers[i] = {
                date: firstDayPrev + 1,
                notThisMonth: true
            };
            firstDayPrev++;
        } else if (i < m.daysInMonth() + firstDay) {
            monthNumbers[k + firstDay] = {
                date: k + 1,
                notThisMonth: false
            };
            k++;
        } else {
            j++;
            monthNumbers[i] = {
                date: j,
                notThisMonth: true
            };
        }
    }



    if (month - 1 === moment().month()) {
      //first mount
        if (pickedDay.date() === moment().date() ) {

            for (let i = 0; i < 42; i++) {
                if (monthNumbers[i].date === moment().date()) {
                    monthNumbers[i]['isToday'] = true;
                    monthNumbers[i]['isPickedDay'] = true;

                }
            }
        }
        //today month change pickedDay
        else {
            for (let i = 0; i < 42; i++) {


                if (monthNumbers[i].date === moment().date()) {
                  monthNumbers[i]['isToday'] = true;
                  monthNumbers[i]['isPickedDay'] = false;

                }
                if (pickedDay.month() === month-1 && monthNumbers[i].date === pickedDay.date()  && !monthNumbers[i].notThisMonth) {
                  monthNumbers[i]['isToday'] = false;
                  monthNumbers[i]['isPickedDay'] = true;

                }
            }
        }
    }
    //change month
    else if (month - 1 !== moment().month()) {


        for (let i = 0; i < 42; i++) {
          monthNumbers[i]['isToday'] = false;
          monthNumbers[i]['isPickedDay'] = false;

        }
        if(pickedDay.month() === month-1){


          for (let i = 0; i < 42; i++) {
            if(pickedDay.date() === monthNumbers[i].date & !monthNumbers[i].notThisMonth){
              monthNumbers[i]['isToday'] = false;
              monthNumbers[i]['isPickedDay'] = true;

            }

          }
        }
    }
    return (dispatch) => {
        return dispatch(() => {
            dispatch(updateMonthNumbers(monthNumbers));
        });
    };
}
export function updateMonthNumbers(monthNumbers) {
    return {type: '@CALENDAR/UPDATE_MONTH_NUMBERS', monthNumbers};
}

export function updateMonth() {
    return (dispatch, getState) => {
        let arr = [];
        for(let i=0;i<32;i++){
            arr[i] = false;
        }
        dispatch(getMonthEnd(arr));
        dispatch(updateMonthNumbersCalc(getState().calendar.year, getState().calendar.month, getState().calendar.pickedDay, getState().monthHasEventList));
        return dispatch(getMonth());
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
