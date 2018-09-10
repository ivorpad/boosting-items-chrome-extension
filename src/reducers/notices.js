const SHOW_NOTICE = "NOTICES/SHOW_NOTICE"

export default (state = [], action) => {
  switch (action.type) {

    case SHOW_NOTICE:
    console.log(action)
      return [
        ...state,
        {
          message: action.message,
          class: action.cssClass
        }
      ]
  default:
    return state
  }
}

export const actions = {
  showNotice: (message, cssClass) => ({ type: SHOW_NOTICE, message, cssClass })
}
