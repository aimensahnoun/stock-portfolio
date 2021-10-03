const INITIAL_STATE = {
  portfolio: [],
};

const porfolioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_PORTFOLIO":
      return {
        ...state,
        portfolio: action.payload,
      };
    case "ADD_STOCK":
      return {
        ...state,
        portfolio: [...state.portfolio, action.payload],
      };
    default:
      return state;
  }
};

export default porfolioReducer;
