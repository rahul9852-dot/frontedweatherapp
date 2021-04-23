import React, { useState } from "react";
import { getDayOfWeekFromEpoch, convertEpochToDate } from "../utils/date";
import { getWeatherIcon } from "../services/AccuWeatherService";
import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  mphToKmh,
  kmhToMph,
  inToCm,
  cmToIn
} from "../utils/converters";
import { isSafari } from "../utils/browsers";
import store from "../redux/store";
import {
  Thermometer as ThermometerIcon,
  CloudRain as CloudRainIcon,
  Wind as WindIcon,
  MoreHorizontal as MoreHorizontalIcon,
  BarChart2 as BarChart2Icon
} from "react-feather";

import "./AccuForecastCard.scss";

const USE_MODERN_ICONS = true;

export default function AccuForecastCard({
  forecast,
  isDay,
  onDetailsClicked
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [temperature, setTemperature] = useState("c");
  const [windSpeed, setWindSpeed] = useState("kmh");
  const [precipitation, setPrecipitation] = useState("cm");

  const date = new Date(convertEpochToDate(forecast.date));

  store.subscribe(() => {
    const { units } = store.getState();

    if (units.temperature !== temperature) {
      setTemperature(units.temperature);
    }
    if (units.windSpeed !== windSpeed) {
      setWindSpeed(units.windSpeed);
    }
    if (units.precipitation !== precipitation) {
      setPrecipitation(units.precipitation);
    }
  });

  const getTemperature = (unit, temp) => {
    switch (unit) {
      case "F":
        if (temperature === "c") {
          return <span>{fahrenheitToCelsius(temp).toFixed(2)} &#176;C</span>;
        } else {
          return <span>{temp} F</span>;
        }
      case "C":
        if (temperature === "c") {
          return <span>{temp} &#176;C</span>;
        } else {
          return <span>{celsiusToFahrenheit(temp).toFixed(2)} F</span>;
        }
      default:
        return (
          <span>
            {temp} {unit}
          </span>
        );
    }
  };

  const getWind = (speed, direction) => {
    let speedStr = `${speed.Value} ${speed.Unit}`;
    if (speed.Unit === "mi/h" && windSpeed === "kmh") {
      speedStr = replaceAllWindsInString(speedStr);
    } else if (speed.Unit === "kmh" && windSpeed === "mph") {
      speedStr = replaceAllWindsInString(speedStr);
    }

    return (
      <div className="wind">
        <span>{direction.English}</span>
        <span>{speedStr}</span>
      </div>
    );
  };

  const getTotalLiquid = (liquid, probability) => {
    switch (liquid.Unit) {
      case "in":
        if (precipitation === "cm") {
          return (
            <span>
              {inToCm(liquid.Value).toFixed(1)} cm ({probability}%)
            </span>
          );
        } else {
          return (
            <span>
              {liquid.Value} in ({probability}%)
            </span>
          );
        }
      case "cm":
        if (precipitation === "in") {
          return (
            <span>
              {cmToIn(liquid.Value).toFixed(1)} cm ({probability}%)
            </span>
          );
        } else {
          return (
            <span>
              {liquid.Value} in ({probability}%)
            </span>
          );
        }
      default:
        return (
          <span>
            {liquid.Value} {liquid.Unit} ({probability}%)
          </span>
        );
    }
  };

  const replaceAllWindsInString = (windStr) => {
    if (windSpeed === "kmh" && windStr.includes("mi/h")) {
      const winds = windStr.match(/\d+/g);
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(winds[i], i);
      }
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(i, Math.floor(mphToKmh(winds[i])));
      }
      windStr = windStr.replace("mi/h", "km/h");
    } else if (windSpeed === "mph" && windStr.includes("kmh")) {
      const winds = windStr.match(/\d+/g);
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(winds[i], i);
      }
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(i, Math.floor(kmhToMph(winds[i])));
      }
      windStr = windStr.replace("km/h", "mi/h");
    }

    return windStr;
  };

  const setFlippedState = (state, isClick) => {
    if (isClick) {
      setIsFlipped(state);
    } else if (!isSafari) {
      setIsFlipped(state);
    }
  };

  const isSameDay = () => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentPartOfDay = () => {
    if (!isSameDay()) {
      return false;
    }
    const hours = new Date().getHours();
    if (
      (hours >= 0 && hours < 6 && !isDay) ||
      (hours >= 6 && hours < 24 && isDay)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div
      className={isFlipped ? "forecast-container flip" : "forecast-container"}
    >
      <div className={isSafari ? "inner is-safari" : "inner"}>
        <div className={isCurrentPartOfDay() ? "front current" : "front"}>
          <div className="info-container">
            <div className="name">
              {getDayOfWeekFromEpoch(forecast.date)} {isDay ? "" : " night"}
            </div>
            <div className="date">{date.toLocaleDateString()}</div>
            <div className="icon-short">
              <img
                className={USE_MODERN_ICONS ? "icon accu modern" : "icon accu"}
                src={getWeatherIcon(forecast.Icon, USE_MODERN_ICONS)}
                alt={forecast.IconPhrase}
              />
              <div className="short">{forecast.ShortPhrase}</div>
            </div>
            <div className="temperature card-item">
              <ThermometerIcon size={24} />
              {getTemperature(
                forecast.temperature.Maximum.Unit,
                forecast.temperature.Maximum.Value
              )}
            </div>
            <div className="precipitation card-item">
              <CloudRainIcon size={24} />
              {getTotalLiquid(
                forecast.TotalLiquid,
                forecast.PrecipitationProbability
              )}
            </div>
            <div className="wind-wrapper card-item">
              <WindIcon size={24} />
              {getWind(forecast.Wind.Speed, forecast.Wind.Direction)}
            </div>
          </div>
          <div className="bottom-container">
            <div
              className="round-button more"
              onClick={() => setFlippedState(true, true)}
              onMouseOver={() => setFlippedState(true, false)}
            >
              <MoreHorizontalIcon size={18} color="#525252" />
            </div>
            <div
              className="round-button details"
              onClick={() => onDetailsClicked(forecast, isDay)}
            >
              <BarChart2Icon size={18} color="#525252" />
            </div>
          </div>
        </div>
        <div
          className="back"
          onMouseOut={() => setFlippedState(false, false)}
          onClick={() => setFlippedState(false, true)}
        >
          <span className="long">
            {forecast.LongPhrase ? forecast.LongPhrase : forecast.ShortPhrase}
          </span>
          <span className="temp-text">
            Temperature between{" "}
            {getTemperature(
              forecast.temperature.Minimum.Unit,
              forecast.temperature.Minimum.Value
            )}{" "}
            and{" "}
            {getTemperature(
              forecast.temperature.Maximum.Unit,
              forecast.temperature.Maximum.Value
            )}
          </span>
          <div
            className="back-image"
            style={{
              backgroundImage: `url(${getWeatherIcon(
                forecast.Icon,
                USE_MODERN_ICONS
              )})`
            }}
          ></div>
          {isSafari && (
            <div className="less" onClick={() => setFlippedState(false, true)}>
              less
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
