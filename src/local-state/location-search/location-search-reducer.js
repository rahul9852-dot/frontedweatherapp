import {
  SET_SEARCH_TERM,
  SET_RESULTS,
  SHOW_RESULTS
} from './location-search-actions';

export const initialState = {
  searchTerm: '',
  results: '',
  showResults: ''
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
    case SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        showResults: true
      };
    case SHOW_RESULTS:
      return {
        ...state,
        showResults: action.payload
      };
    default:
      return state;
  }
};
