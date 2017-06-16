

const initMainState = {
    navbarToggle: false,
    todaysDate: null
};
export function main(state = initMainState, action) {
    switch (action.type) {
        case '@MAIN/TOGGLE_NAVBAR':
            return {
                ...state,
                navbarToggle: !state.navbarToggle
            };
        case '@MAIN/UPDATE_CURRENT_DATE':
            return {
                ...state,
                todaysDate: action.date
            };
        default:
            return state;
    }
}
