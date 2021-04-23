import React, { useState } from "react";
import { connect } from "react-redux";
import {
  toggleTemperature,
  toggleWindSpeed,
  togglePrecipitation
} from "../redux/actions";
import store from "../redux/store";
import {
  Thermometer as ThermometerIcon,
  Wind as WindIcon,
  Droplet as DropletIcon,
  XCircle as XCircleIcon
} from "react-feather";

import "./UnitChanger.scss";

function UnitChanger(props) {
  const [showInfo, setShowInfo] = useState(false);
  const [temp, setTemp] = useState("c");
  const [speed, setSpeed] = useState("kmh");
  const [precipitation, setPrecipitation] = useState("cm");

  const onTemperatureChange = (event) => {
    props.toggleTemperature(event.target.value);
  };

  const onWindSpeedChange = (event) => {
    props.toggleWindSpeed(event.target.value);
  };

  const onPrecipitationChange = (event) => {
    props.togglePrecipitation(event.target.value);
  };

  store.subscribe(() => {
    const { units } = store.getState();
    if (units.temperature !== temp) {
      setTemp(units.temperature);
    }
    if (units.windSpeed !== speed) {
      setSpeed(units.windSpeed);
    }
    if (units.precipitation !== precipitation) {
      setPrecipitation(units.precipitation);
    }
  });

  return (
    <div className="unit-changer-wrapper">
      <span
        className="change-units-clickable"
        onClick={() => setShowInfo(!showInfo)}
      >
        {!showInfo ? "Change units" : ""}
      </span>
      {showInfo && (
        <div className="select-container">
          <span>Change units</span>
          <button
            className="close-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            <XCircleIcon size={22} color="#656565" />
          </button>
          <div className="unit-select">
            <ThermometerIcon size={18} />
            <select value={temp} onChange={onTemperatureChange}>
              <option value="c">&deg;C</option>
              <option value="f">F</option>
            </select>
          </div>
          <div className="unit-select">
            <WindIcon size={18} />
            <select value={speed} onChange={onWindSpeedChange}>
              <option value="mph">mph</option>
              <option value="kmh">km/h</option>
            </select>
          </div>
          <div className="unit-select">
            <DropletIcon size={18} />
            <select value={precipitation} onChange={onPrecipitationChange}>
              <option value="in">in</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(null, {
  toggleTemperature,
  toggleWindSpeed,
  togglePrecipitation
})(UnitChanger);
