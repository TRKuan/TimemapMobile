import moment from 'moment';
import uuid from 'uuid/v4'
const initCalendarState = {
    userId: uuid(),
    events: [],
    year: moment().year(),
    month: moment().month()+1,
    pickedDay: moment(),
    monthHasEventList: [],
    monthNumbers: [],
    nextEvent: null,
    dayEvents: [],
    leaveTime: 0,
    leaveTimeId:0,
    nextBack: 'normal-back',
    notified: false
};

export function calendar(state = initCalendarState, action) {
    let events = null;
    switch (action.type) {
    case '@CALENDAR/ADD_EVENT_START':
        return {
            ...state
        };
    case '@CALENDAR/ADD_EVENT_END':
        events = state.events.slice();
        events.push(action.event);
        return {
            ...state,
            events
        };
    case '@CALENDAR/DELETE_EVENT':
        events = state.events.slice();
        events = events.filter(function(el) {
          return el.evntId !== action.eventId;
        });
        return {
            ...state,
            events
        };
    case '@CALENDAR/SET_EVENT':
        events = state.events.slice();
        for(let event of events){
            if(action.id === event.id){
                event[action.key] = action.value;
                break;
            }
        }
        return {
            ...state,
            events
        };
    case '@CALENDAR/GET_NEXT_EVENT_START':
        return{
            ...state
        };
    case '@CALENDAR/GET_NEXT_EVENT_END':
        return{
            ...state,
            nextEvent: action.event
        };
    case '@CALENDAR/UPDATE_NEXT_EVENT_START':
        return {
            ...state
        };
    case '@CALENDAR/UPDATE_NEXT_EVENT_END':
        return {
            ...state,
            nextEvent: action.event
        };
    case '@CALENDAR/GET_MONTH_START':
        return{
            ...state
        }
    case '@CALENDAR/GET_MONTH_END':
        return{
            ...state,
            monthHasEventList: action.hasEventList
        }
    case '@CALENDAR/GET_DAY_EVENTS_START':
        return {
            ...state
        }
    case '@CALENDAR/GET_DAY_EVENTS_END':
        return {
            ...state,
            dayEvents: action.events
        }
    case '@CALENDAR/SET_PICKED_DAY':
        return {
            ...state,
            pickedDay: action.pickedDay
        };
    case '@CALENDAR/SET_MONTH':
        return {
            ...state,
            month: action.month
        };
    case '@CALENDAR/SET_YEAR':
        return {
            ...state,
            year: action.year
        };
    case '@CALENDAR/UPDATE_MONTH_NUMBERS':
        return {
            ...state,
            monthNumbers: action.monthNumbers
        };
    case '@CALENDAR/PICK_DAY':
        let newMonthNumbers = state.monthNumbers.slice();
        for(let i=0; i<42; i++){
          if(newMonthNumbers[i].isPickedDay){
            newMonthNumbers[i].isPickedDay = false;
          }
        }
        newMonthNumbers[action.cellNum].isPickedDay = true;
        return {
            ...state,
            monthNumbers: newMonthNumbers
        };
    case '@CALENDAR/SET_LEAVE_TIME':
        if(!state.nextEvent)return state;
        let leaveTime = moment(state.nextEvent.startTs).unix()-moment().unix()-state.nextEvent.duration;
        return {
            ...state,
            leaveTime
        };
    case '@CALENDAR/SET_LEAVE_TIME_ID':
        return {
            ...state,
            leaveTimeId: action.id
        };
    case '@CALENDAR/CLEAR_LEAVE_TIME':
        return {
            ...state
        }
    case '@CALENDAR/SET_BACK':
        return {
            ...state,
            nextBack: action.back
        }
    case '@CALENDAR/SET_NOTIFIED':
        return {
            ...state,
            notified: action.notified
        }
    case '@CALENDAR/SET_USER_ID':
        return {
            ...state,
            userId: action.id
        }
    default:
        return state;
    }
}
