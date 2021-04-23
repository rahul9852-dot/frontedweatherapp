import {
  TOGGLE_TEMPERATURE,
  TOGGLE_WINDSPEED,
  TOGGLE_PRECIPITATION,
  SET_FORECAST,
  SET_LOCATION,
  ADD_PINNED_LOCATION,
  REMOVE_PINNED_LOCATION
} from './actionTypes';

export const toggleTemperature = temp => ({
  type: TOGGLE_TEMPERATURE,
  payload: { temp }
});

export const toggleWindSpeed = speed => ({
  type: TOGGLE_WINDSPEED,
  payload: { speed }
});

export const togglePrecipitation = precipitation => ({
  type: TOGGLE_PRECIPITATION,
  payload: { precipitation }
});

export const setForecast = details => ({
  type: SET_FORECAST,
  payload: { details }
});

export const setLocation = details => ({
  type: SET_LOCATION,
  payload: { details }
});

export const addPinnedLocation = details => ({
  type: ADD_PINNED_LOCATION,
  payload: { details }
});

export const removePinnedLocation = details => ({
  type: REMOVE_PINNED_LOCATION,
  payload: { details }
});
