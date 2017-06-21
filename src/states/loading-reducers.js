const initLoadingState = {
    loading: true
};

export function loading(state = initLoadingState, action) {
    switch (action.type) {
    case '@LOADING/SET_LOADING':
        return {
            ...state,
            loading: action.loading
        }
    default:
        return state;
    }
}
