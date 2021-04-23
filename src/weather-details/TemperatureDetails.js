import React, { useState, useEffect } from "react";
import {
  Thermometer as ThermometerIcon,
  ArrowDown as ArrowDownIcon,
  ArrowUp as ArrowUpIcon
} from "react-feather";
import store from "../redux/store";
import { fahrenheitToCelsius, celsiusToFahrenheit } from "../utils/converters";

export default function TemperatureDetails({
  temperature,
  realFeelTemperature,
  degreeDaySummary
}) {
  const [tempUnit, setTempUnit] = useState("c");

  useEffect(() => {
    setUnitType();

    const unsubscribe = store.subscribe(() => {
      setUnitType();
    });

    return unsubscribe;
  }, []);

  const setUnitType = () => {
    const { units } = store.getState();
    if (units.temperature !== tempUnit) {
      setTempUnit(units.temperature);
    }
  };

  const getTemperature = (temp) => {
    switch (temp.Unit) {
      case "F":
        if (tempUnit === "c") {
          return `${fahrenheitToCelsius(temp.Value).toFixed(2)}`;
        } else {
          return `${temp.Value}`;
        }
      case "C":
        if (tempUnit === "c") {
          return `${temp.Value}`;
        } else {
          return `${celsiusToFahrenheit(temp.Value).toFixed(2)}`;
        }
      default:
        return `${temp.Value}`;
    }
  };

  const getTemperatureUnit = () => {
    return tempUnit === "c" ? "°C" : "F";
  };

  const getDegreeSummary = () => {
    const isHeating = !!degreeDaySummary.Heating.Value;

    if (isHeating) {
      return (
        <span className="line-with-icon">
          {Math.abs(getTemperature(degreeDaySummary.Heating))}{" "}
          {getTemperatureUnit()} <ArrowUpIcon size={14} />
        </span>
      );
    } else {
      return (
        <span className="line-with-icon">
          {Math.abs(getTemperature(degreeDaySummary.Cooling))}{" "}
          {getTemperatureUnit()} <ArrowDownIcon size={14} />
        </span>
      );
    }
  };

  return (
    <div className="details-container">
      <div className="icon">
        <ThermometerIcon size={32} />
      </div>
      <div className="content">
        <div>
          {getTemperature(temperature.Minimum)} /{" "}
          {getTemperature(temperature.Maximum)} {getTemperatureUnit()}
        </div>
        <div>
          Real feel: {getTemperature(realFeelTemperature.Minimum)} /{" "}
          {getTemperature(realFeelTemperature.Maximum)} {getTemperatureUnit()}
        </div>
        <div>{getDegreeSummary()}</div>
      </div>
    </div>
  );
}
