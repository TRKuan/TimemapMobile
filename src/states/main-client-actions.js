export function toggleNavbar() {
    return {
        type: '@MAIN/TOGGLE_NAVBAR'
    };
}
export function updateCurrentDate(date) {
    return {
        type: '@MAIN/UPDATE_CURRENT_DATE',
        date
    };
}
