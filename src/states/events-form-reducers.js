const initEventsFormState = {
    title: '',
    startTimeYMD:null,
    startTimeHM:null,
    endTimeYMD: null,
    endTimeHM: null,
    label: '',
    transportation: 'car',
    description: '',
    location: '',
    geoLocation: ''
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
                  title: action.form.title,
                  startTimeYMD: action.form.startTimeYMD,
                  startTimeHM: action.form.startTimeHM,
                  endTimeYMD: action.form.endTimeYMD,
                  endTimeHM: action.form.endTimeHM,
                  label:  action.form.label,
                  transportation:  action.form.transportation,
                  description:  action.form.description,
                  location:  action.form.location
              };
        case '@EVENTSFORM/UPDATE_FORM':
              return {
                  initEventsFormState
              };
        default:
            return state;
    }
}
