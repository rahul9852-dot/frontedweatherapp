import { take, select, call, put, fork } from "redux-saga/effects";
import {
  getLatestForecast,
  getLatestForecastLocation,
  getNearestLocationByGeometry,
  getForecastByGeometry,
  getUseAccuweather,
  getForecasts,
  getCurrentConditions
} from "../redux/selectors";
import { getGeoByIp } from "../services/GeoLocationService";
import { getNearestCities } from "../services/ReverseGeoCodeService";
import { compareCoordinates } from "../utils/compare";
import { getLocattionByCityName } from "../services/OpenCageService";
import { transformLocationData } from "../utils/data-transformer";
import {
  datesAreOnSameDay,
  dateOlderThanGivenDays,
  dateOlderThanGivenHours
} from "../utils/date";
import { getWeatherByCoordinates } from "../services/OpenWeatherService";
import {
  getLocationIdByGeoposition,
  getForecastByLocationKey,
  getCurrentConditionsByLocationKey
} from "../services/AccuWeatherService";
import {
  LOAD_FORECAST,
  SET_CURRENT_FORECAST,
  GET_WEATHER_BY_GEOMETRY,
  SET_CURRENT_LOCATION,
  LOCATION_CLICKED,
  SET_LOCATION,
  SET_FORECAST,
  CLEAR_FORECASTS,
  DELETE_FORECASTS_BY_KEY,
  SET_CURRENT_CONDITION,
  REFRESH_CURRENT_CONDITION
} from "../redux/actionTypes";

/**
 * Wait for LOAD_FORECAST action, get latest forecast and forecast location from store.
 * If available, set forecast from latest data available,
 * if not start the location-forecast queries.
 */
function* loadForecastSaga() {
  yield take(LOAD_FORECAST);
  const latestForecast = yield select(getLatestForecast);
  const latestForecastLocation = yield select(getLatestForecastLocation);
  if (latestForecast && latestForecastLocation) {
    console.log(
      `[S] previous forecast available for ${
        latestForecastLocation.formatted
      }, loading it from store (${new Date(latestForecast.savedAt)})`
    );
    yield call(setFromLatestSaga, latestForecast, latestForecastLocation);
  } else {
    yield call(getLocationsByIPSaga);
  }
}

/**
 * Set latest forecast and current location. If forecast date is older than 1 day,
 * get fresh data from api.
 * @param {*} latestForecast
 * @param {*} latestForecastLocation
 */
function* setFromLatestSaga(latestForecast, latestForecastLocation) {
  yield put({
    type: SET_CURRENT_FORECAST,
    payload: { forecast: latestForecast, geometry: latestForecast.geometry }
  });
  const location = yield call(transformLocationData, latestForecastLocation);
  yield put({ type: SET_CURRENT_LOCATION, payload: { location } });
  const sameDay = yield call(todaySaga, latestForecast.savedAt);
  if (!sameDay) {
    console.log(
      `[S] loaded forecast is too old (${new Date(
        latestForecast.savedAt
      )}), refreshing it automatically`
    );
    yield put({
      type: GET_WEATHER_BY_GEOMETRY,
      payload: latestForecastLocation.geometry
    });
  }
}

/**
 * Get geometry by IP. If a geometry is near to one in the store, call LOCATION_CLICKED action.
 * Else make a reverse geocoding.
 */
function* getLocationsByIPSaga() {
  const geo = yield call(getGeoByIp);
  const foundLocation = yield select(getNearestLocationByGeometry, geo);
  if (foundLocation) {
    console.log(
      `[S] found location ${foundLocation.formatted} by geometry in store, loading it`
    );
    yield put({ type: LOCATION_CLICKED, payload: foundLocation });
  } else {
    yield call(reverseGeocodingSaga, geo);
  }
}

/**
 * Make nearest cities API call, compare the result wirh geometry parameter to find a match.
 * Add the matched city data as a location, call LOCATION_CLICKED action.
 * @param {*} geometry
 */
function* reverseGeocodingSaga(geometry) {
  const nearestCities = yield call(
    getNearestCities,
    geometry.lat,
    geometry.lng
  );
  let reverseGeoLocation;
  for (const city of nearestCities) {
    const cityGeo = { lat: city.Latitude, lng: city.Longitude };
    const match = yield call(compareCoordinates, geometry, cityGeo);
    if (match) {
      console.log(
        `[S] nearest cities for geometry: ${geometry.lat},${geometry.lng} found`
      );
      reverseGeoLocation = city;
      break;
    }
  }
  reverseGeoLocation = reverseGeoLocation
    ? reverseGeoLocation
    : nearestCities[0];
  const locationByCityName = yield call(
    getLocattionByCityName,
    reverseGeoLocation.City
  );
  yield put({
    type: SET_LOCATION,
    payload: {
      details: {
        term: reverseGeoLocation.City.toLowerCase(),
        results: locationByCityName.results
      }
    }
  });
  console.log(`[S] setting location to ${reverseGeoLocation.City}`);
  yield put({
    type: LOCATION_CLICKED,
    payload: locationByCityName.results[0]
  });
}

/**
 * Wait for LOCATION_CLICKED action. Set the current location to the payload.
 * Get the saved forecast for the location. If the forecast is not older than 1 day,
 * set it from store as current forecast. Else get a fresh one from API.
 * Else if no saved forecast is available, get it from API.
 * API call means calling GET_WEATHER_BY_GEOMETRY action.
 */
function* locationClickedSaga() {
  while (true) {
    const { payload: details } = yield take(LOCATION_CLICKED);
    let location;
    if (details.annotations) {
      location = yield call(transformLocationData, details);
    } else {
      location = details;
    }
    yield put({ type: SET_CURRENT_LOCATION, payload: { location } });
    const savedForecast = yield select(getForecastByGeometry, details.geometry);
    if (savedForecast) {
      const sameDay = yield call(todaySaga, savedForecast.savedAt);
      if (sameDay) {
        console.log("[S] loading forecast from store", savedForecast.geometry);
        yield put({
          type: SET_CURRENT_FORECAST,
          payload: {
            forecast: savedForecast,
            geometry: savedForecast.geometry
          }
        });
      } else {
        console.log(
          "[S] getting forecast from api - data too old in store",
          details.geometry
        );
        yield put({
          type: GET_WEATHER_BY_GEOMETRY,
          payload: details.geometry
        });
      }
    } else {
      console.log(
        "[S] getting forecast from api by geometry",
        details.geometry
      );
      yield put({ type: GET_WEATHER_BY_GEOMETRY, payload: details.geometry });
    }
  }
}

/**
 * Wait for GET_WEATHER_BY_GEOMETRY action containing the geometry.
 * Check which api needs to be used. Call the proper API with geometry parameter.
 */
function* getWeatherByGeometrySaga() {
  while (true) {
    const { payload: geometry } = yield take(GET_WEATHER_BY_GEOMETRY);
    const useAccuWeather = yield select(getUseAccuweather);
    if (useAccuWeather) {
      yield call(getAccuWeatherSaga, geometry);
    } else {
      yield call(getOpenWeatherSaga, geometry);
    }
  }
}

/**
 * Call open weather API with geometry, set it as current forecast
 * by calling SET_CURRENT_FORECAST action.
 * @param {*} geometry
 */
function* getOpenWeatherSaga(geometry) {
  try {
    const forecast = yield call(
      getWeatherByCoordinates,
      geometry.lat,
      geometry.lng
    );
    yield put({
      type: SET_CURRENT_FORECAST,
      payload: { forecast, geometry }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get forecast for`, geometry);
  }
}

/**
 * Get locationId from geometry by calling API. After that get forecast by locationId from
 * accuweather API and set it as current forecast by calling SET_CURRENT_FORECAST action.
 * @param {*} geometry
 */
function* getAccuWeatherSaga(geometry) {
  try {
    const locationId = yield call(
      getLocationIdByGeoposition,
      geometry.lat,
      geometry.lng
    );
    const accuForecast = yield call(getForecastByLocationKey, locationId.Key);
    const { DailyForecasts } = accuForecast;
    const savedAt = new Date().getTime();
    const forecast = { DailyForecasts, savedAt, geometry };
    yield put({
      type: SET_CURRENT_FORECAST,
      payload: { forecast, geometry }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get forecast for`, geometry);
  }
}

/**
 * Wait for SET_CURRENT_FORECAST action. Set forecast after some formatting
 * by calling SET_FORECAST action.
 */
function* setCurrentForecastSaga() {
  while (true) {
    const {
      payload: { forecast, geometry }
    } = yield take(SET_CURRENT_FORECAST);
    if (forecast && forecast.DailyForecasts) {
      yield put({
        type: SET_FORECAST,
        payload: {
          details: forecast
        }
      });
    } else if (forecast && forecast.properties) {
      const { generatedAt, periods } = forecast.properties;
      const savedAt = new Date().getTime();
      yield put({
        type: SET_FORECAST,
        payload: {
          details: {
            properties: { periods },
            savedAt,
            generatedAt,
            geometry
          }
        }
      });
    }
  }
}

/**
 * Return that the given day is today's date or not.
 * @param {*} date
 */
function* todaySaga(date) {
  const now = new Date().getTime();
  return yield call(datesAreOnSameDay, now, date);
}

/**
 * Wait for CLEAR_FORECASTS action. Get forecasts, check each one if it's older than 2 days.
 * Delete these forecasts by calling DELETE_FORECASTS_BY_KEY action.
 */
function* clearForecastsSaga() {
  yield take(CLEAR_FORECASTS);
  const forecasts = yield select(getForecasts);
  const keys = Object.keys(forecasts);
  if (keys.length > 1) {
    const deletableKeys = [];
    for (let i = 0; i < keys.length; i++) {
      const { savedAt } = forecasts[keys[i]];
      const tooOld = yield call(dateOlderThanGivenDays, savedAt, 2);
      if (tooOld) {
        deletableKeys.push(keys[i]);
      }
    }
    if (deletableKeys.length > 0) {
      yield put({
        type: DELETE_FORECASTS_BY_KEY,
        payload: {
          details: deletableKeys
        }
      });
    }
  }
}

/**
 * Wait for SET_CURRENT_LOCATION action. Get current conditions from store.
 * If available and geometry matches and data not older than 2 hours load it from store.
 * Else call API to get it.
 */
function* setCurrentConditionsSaga() {
  while (true) {
    const {
      payload: { location }
    } = yield take(SET_CURRENT_LOCATION);
    const { geometry } = location;

    const currConditions = yield select(getCurrentConditions);
    if (currConditions) {
      if (
        geometry.lat === currConditions.geometry.lat &&
        geometry.lng === currConditions.geometry.lng
      ) {
        const tooOld = yield call(
          dateOlderThanGivenHours,
          currConditions.savedAt,
          2
        );
        if (tooOld) {
          yield call(getCurrentConditionsSaga, geometry);
          console.log(
            `[S] loaded current conditions is too old (${new Date(
              currConditions.savedAt
            )}), refreshing it automatically`
          );
        } else {
          console.log(
            "[S] previous current condition is available, loading it from store"
          );
        }
      } else {
        yield call(getCurrentConditionsSaga, geometry);
        console.log(
          "[S] previous current condition location doesn't match current location, refreshing it automatically"
        );
      }
    } else {
      yield call(getCurrentConditionsSaga, geometry);
      console.log("[S] getting current conditions from api by geometry");
    }
  }
}

/**
 * Wait for REFRESH_CURRENT_CONDITION.
 * Force refresh current conditions by calling API.
 */
function* refreshCurrentConditionsSaga() {
  while (true) {
    yield take(REFRESH_CURRENT_CONDITION);
    const currConditions = yield select(getCurrentConditions);
    if (currConditions) {
      const { locationKey, geometry } = currConditions;
      yield call(getCurrentConditionsSaga, geometry, locationKey);
      console.log("[S] refreshing current conditions from api by locationKey");
    } else {
      console.log("[S] no current conditions available, cannot refresh it");
    }
  }
}

/**
 * Get locationId from geometry by calling API. From locationId get current conditions
 * by calling API. Call SET_CURRENT_CONDITION action to save it to store.
 * @param {*} geometry
 */
function* getCurrentConditionsSaga(geometry, locKey) {
  try {
    let locationKey;
    if (locKey) {
      locationKey = locKey;
    } else {
      const locationId = yield call(
        getLocationIdByGeoposition,
        geometry.lat,
        geometry.lng
      );
      locationKey = locationId.Key;
    }
    const currConditions = yield call(
      getCurrentConditionsByLocationKey,
      locationKey,
      true
    );
    const savedAt = new Date().getTime();
    const currentConditions = {
      ...currConditions[0],
      savedAt,
      geometry,
      locationKey: locationKey
    };
    yield put({
      type: SET_CURRENT_CONDITION,
      payload: { currentConditions }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get current condiions for`, geometry);
  }
}

export default function* forecastSaga() {
  yield fork(loadForecastSaga);
  yield fork(locationClickedSaga);
  yield fork(getWeatherByGeometrySaga);
  yield fork(setCurrentForecastSaga);
  yield fork(clearForecastsSaga);
  yield fork(setCurrentConditionsSaga);
  yield fork(refreshCurrentConditionsSaga);
}
