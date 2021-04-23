import {
  SHOW_DETAILS,
  SET_IS_DAY_DETAILS,
  DETAILS_CLICKED
} from './app-actions';

export const initialState = {
  showDetails: false,
  details: null,
  isDayDetails: false
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SHOW_DETAILS:
      return {
        ...state,
        showDetails: action.payload
      };
    case SET_IS_DAY_DETAILS:
      return {
        ...state,
        isDayDetails: action.payload
      };
    case DETAILS_CLICKED:
      return {
        ...state,
        details: action.payload.forecast,
        isDayDetails: action.payload.isDay,
        showDetails: true
      };
    default:
      return state;
  }
};
