
export function submitForm(form) {
    return {
        type: '@EVENTSFORM/SUBMIT_FORM',
        form
    };
}
export function cleanForm(){
  return {
      type: '@EVENTSFORM/CLEAN_FORM'
  };

}
