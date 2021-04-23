import axios from "axios";

const BASE_URL = "https://dataservice.accuweather.com/";
const API_KEY = process.env.REACT_APP_ACCUWEATHER_API_KEY;

/**
 * https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/cities/geoposition/search
 * @param {*} lat
 * @param {*} lng
 */
export function getLocationIdByGeoposition(lat, lng) {
  let url = `${BASE_URL}locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat},${lng}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 * https://developer.accuweather.com/accuweather-forecast-api/apis/get/forecasts/v1/daily/5day/%7BlocationKey%7D
 * @param {*} locationKey
 * @param {*} days
 * @param {Boolean} details
 * @param {*} metric
 */
export function getForecastByLocationKey(
  locationKey,
  days = 5,
  details = true,
  metric
) {
  days = getDays(days);
  let url = `${BASE_URL}forecasts/v1/daily/${days}day/${locationKey}?apikey=${API_KEY}&details=${details}&metric=${metric}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 * https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/%7BlocationKey%7D
 * @param {*} locationKey
 * @param {Boolean} details
 */
export function getCurrentConditionsByLocationKey(
  locationKey,
  details = false
) {
  let url = `${BASE_URL}currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=${details}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 *
 * @param {*} iconNumber
 * @param {*} useModerIcons
 */
export function getWeatherIcon(iconNumber, useModernIcons) {
  const iconNum = iconNumber.toString().padStart(2, "0");

  if (useModernIcons) {
    return `https://www.accuweather.com/images/weathericons/${iconNum}.svg`;
  } else {
    return `https://developer.accuweather.com/sites/default/files/${iconNum}-s.png`;
  }
}

const getDays = (days) => {
  switch (days) {
    case 1:
    case 5:
    case 10:
    case 15:
      return days;
    default:
      return 5;
  }
};
