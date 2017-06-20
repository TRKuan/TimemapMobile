const initEventsFormState = {
    title: '',
    startTs: "",
    endTs: "",
    transportation: 'walking',
    description: '',
    location: '',
    geoLocation: {},
    timeInvalid: true,
    walking: true,
    dirving: false,
    cycling: false
};
export function eventsForm(state = initEventsFormState, action) {
    switch (action.type) {
        case '@EVENTSFORM/UPDATE_TIME':
            if(action.field === 'startValue'){
                return {
                    ...state,
                    startTime: action.time
                };
            }
            else if(action.field === 'endValue'){
                return {
                    ...state,
                    endTime: action.time
                };
            }
        case '@EVENTSFORM/UPDATE_TRANS':
              return {
                  ...state,
                  transportation: action.trans
              };
        case '@EVENTSFORM/UPDATE_DES':
              return {
                  ...state,
                  description: action.des
              };
        case '@EVENTSFORM/SUBMIT_FORM':
              return {
                  ...state,
                  ...action.form
              };
        case '@EVENTSFORM/CLEAN_FORM':
            return{
                ...initEventsFormState
            }
        case '@EVENTSFORM/UPDATE_FORM':
              return {
                  initEventsFormState
              };
        default:
            return state;
    }
}
