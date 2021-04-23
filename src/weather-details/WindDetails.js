import React, { useState, useEffect } from "react";
import {
  Wind as WindIcon,
  Navigation2 as Navigation2Icon
} from "react-feather";
import store from "../redux/store";
import { mphToKmh, kmhToMph } from "../utils/converters";

export default function WindDetails({ wind, windGust }) {
  const [windSpeedUnit, setWindSpeedUnit] = useState("kmh");

  useEffect(() => {
    setUnitType();

    const unsubscribe = store.subscribe(() => {
      setUnitType();
    });

    return unsubscribe;
  }, []);

  const setUnitType = () => {
    const { units } = store.getState();
    if (units.windSpeed !== windSpeedUnit) {
      setWindSpeedUnit(units.windSpeed);
    }
  };

  const getWind = (wind, showDirection = false) => {
    const direction = showDirection ? `${wind.Direction.English} at ` : "";
    switch (wind.Speed.Unit) {
      case "mi/h":
        if (windSpeedUnit === "kmh") {
          return `${direction}${Math.floor(mphToKmh(wind.Speed.Value))} km/h`;
        } else {
          return `${direction}${wind.Speed.Value} mi/h`;
        }
      case "kmh":
        if (windSpeedUnit === "mph") {
          return `${direction}${Math.floor(kmhToMph(wind.Speed.Value))} mi/h`;
        } else {
          return `${direction}${wind.Speed.Value} km/h`;
        }
      default:
        return `${direction}${wind.Speed.Value} ${wind.Speed.Unit}`;
    }
  };

  return (
    <div className="details-container">
      <div className="icon">
        <WindIcon size={32} />
      </div>
      <div className="content">
        <div className="line-with-icon">
          {getWind(wind, true)}
          <Navigation2Icon
            size={14}
            style={{ transform: `rotate(${wind.Direction.Degrees + 0}deg)` }}
          />
        </div>
        <div className="line-with-icon">Wind gust: {getWind(windGust)}</div>
      </div>
    </div>
  );
}
