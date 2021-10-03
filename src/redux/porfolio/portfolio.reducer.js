const INITIAL_STATE = {
  portfolio: null,
};

const porfolioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_PORTFOLIO":
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};

export default porfolioReducer;
