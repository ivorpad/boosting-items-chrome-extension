const types = {
  FETCH_HIGHLIGHTS: "HIGHLIGHTS/FETCH_HIGHLIGHTS",
  FETCH_SUCCESS: "HIGHLIGHTS/FETCH_SUCCESS",
  FETCH_ERROR: "HIGHLIGHTS/FETCH_ERROR"
};

// eslint-disable-next-line no-undef
// chrome.storage.sync.get(["baseUrlValue"], (r) => {
//   console.log(r)
// });

export default (state = [], action) => {
  switch (action.type) {
    case "typeName":
      return { ...state };

    default:
      return state;
  }
};

const actions = {

}
