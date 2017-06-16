const initNextEventState = {
      timeLeft: null,
      label: 'na',
      title: 'na',
      time: 'na',
      location: 'na'
};
export function todayNextEvent(state = initNextEventState, action) {
    switch (action.type) {
        case '@TODAY/GET_NEXTEVENT':
            return {
                ...state,
            };

        default:
            return state;
    }
}
