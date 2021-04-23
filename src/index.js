import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import ForecastList from "./forecast-list/ForecastList";
import UnitChanger from "./unit-changer/UnitChanger";
import LocationInfo from "./location-info/LocationInfo";
import Modal from "./modal/Modal";
import WeatherDetails from "./weather-details/WeatherDetails";
import { saveState } from "./utils/localStorage";
import { takeOverConsole } from "./utils/consoleCapturer";
import { Provider } from "react-redux";
import store from "./redux/store";
import { connect } from "react-redux";
import { SHOW_DETAILS, DETAILS_CLICKED } from "./local-state/app/app-actions";
import { reducer, initialState } from "./local-state/app/app-reducer";
import LogDisplay from "./log-display/LogDisplay";
import { getAppVersion } from "./utils/app-version";
import { isParamWithValueAvailable } from "./utils/query-param-extractor";
import LocationChanger from "./location-changer/LocationChanger";
import CurrentConditions from "./current-conditions/CurrentConditions";
import { Loader as LoaderIcon } from "react-feather";

import "./styles.scss";

function App(props) {
  // console.log(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showDetails, details, isDayDetails } = state;
  const [isSelectedLocationPinned, setIsSelectedLocationPinned] = useState(
    false
  );
  const [consoleArgs, setConsoleArgs] = useState(null);
  const [consoleMessageType, setConsoleMessageType] = useState(null);
  const [appVersion, setAppVersion] = useState("");
  const [showConsole, setShowConsole] = useState(false);

  const {
    forecast: { currentForecast: forecast, currentConditions },
    locations: { currentLocation: location, pinnedLocations },
    useAccuWeatherApi
  } = props;

  useEffect(() => {
    setAppVersion(getAppVersion());
    if (isParamWithValueAvailable("showLog", "1")) {
      takeOverConsole(consoleCallback);
      setShowConsole(true);
    }
    props.dispatch({ type: "LOAD_FORECAST" });
    props.dispatch({ type: "CLEAR_FORECASTS" });
  }, []);

  useEffect(() => {
    const keys = pinnedLocations ? Object.keys(pinnedLocations) : [];
    let isPinned = false;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === location.name) {
        isPinned = true;
        break;
      }
    }
    setIsSelectedLocationPinned(isPinned);
  }, [props.locations]);

  store.subscribe(() => {
    saveState({
      ...store.getState()
    });
  });

  const onLocationClicked = (details) => {
    props.dispatch({ type: "LOCATION_CLICKED", payload: details });
  };

  const onApiChanged = (e) => {
    if (e.target.value === "accuweather") {
      props.dispatch({ type: "USE_ACCUWEATHER", payload: true });
    } else {
      props.dispatch({ type: "USE_ACCUWEATHER", payload: false });
    }
  };

  const onDetailsClicked = (forecast, isDay) => {
    dispatchLocalAction(DETAILS_CLICKED, { forecast, isDay });
  };

  const onRefreshWeatherClicked = () => {
    props.dispatch({
      type: "GET_WEATHER_BY_GEOMETRY",
      payload: forecast.geometry
    });
  };

  const onRefreshCurrentConditionsClicked = () => {
    props.dispatch({
      type: "REFRESH_CURRENT_CONDITION"
    });
  };

  const removePinnedLocation = (name) => {
    props.dispatch({
      type: "REMOVE_PINNED_LOCATION",
      payload: { name }
    });
  };

  const onPinClicked = () => {
    if (!isSelectedLocationPinned) {
      props.dispatch({
        type: "ADD_PINNED_LOCATION",
        payload: { location }
      });
    } else {
      removePinnedLocation(location.name);
    }
  };

  const loadLocation = (location) => {
    onLocationClicked(location);
  };

  const dispatchLocalAction = (type, payload) => {
    dispatch({
      type,
      payload
    });
  };

  const consoleCallback = (method, args) => {
    setConsoleMessageType(method);
    setConsoleArgs(args);
  };

  return (
    <div className={showDetails ? "App disable-scroll" : "App"}>
      <Modal
        show={showDetails}
        onClose={() => dispatchLocalAction(SHOW_DETAILS, false)}
      >
        <WeatherDetails details={details} isDay={isDayDetails} />
      </Modal>
      <div className="location-changer-container">
        <LocationChanger
          forecast={forecast}
          location={location}
          useAccuWeatherApi={useAccuWeatherApi}
          onLocationClicked={onLocationClicked}
          onApiChanged={onApiChanged}
          onRefreshWeatherClicked={onRefreshWeatherClicked}
          pinnedLocations={pinnedLocations}
          removePinnedLocation={removePinnedLocation}
          loadLocation={loadLocation}
        />
        <CurrentConditions
          currentConditions={currentConditions}
          onRefreshCurrentConditionsClicked={onRefreshCurrentConditionsClicked}
        />
      </div>
      {(!forecast || (!forecast.properties && !forecast.DailyForecasts)) && (
        <div
          className={!forecast || !location ? "info-text animate" : "info-text"}
        >
          <LoaderIcon size={18} />
          {!location
            ? "Searching for current location..."
            : "No weather information available!"}
        </div>
      )}
      <div className="weather-container">
        <div className="unit-changer-container">
          {location && (
            <LocationInfo
              location={location}
              isPinned={isSelectedLocationPinned}
              onPinClicked={onPinClicked}
            />
          )}
          {forecast && (forecast.properties || forecast.DailyForecasts) && (
            <UnitChanger />
          )}
        </div>
        {forecast && forecast.properties && (
          <ForecastList periods={forecast.properties.periods} />
        )}
        {forecast && forecast.DailyForecasts && (
          <ForecastList
            periods={forecast.DailyForecasts}
            onDetailsClicked={onDetailsClicked}
          />
        )}
      </div>
      {showConsole && (
        <LogDisplay args={consoleArgs} type={consoleMessageType} />
      )}
      <div className="app-version">v{appVersion}</div>
    </div>
  );
}

function mapStateToProps(state) {
  const {
    forecast,
    locations,
    units: { useAccuWeatherApi }
  } = state;
  return {
    forecast,
    locations,
    useAccuWeatherApi
  };
}

const ConnectedApp = connect(mapStateToProps, null)(App);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  rootElement
);
