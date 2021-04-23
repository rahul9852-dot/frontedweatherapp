import React, { useState, useEffect } from "react";
import { CloudRain as CloudRainIcon } from "react-feather";
import store from "../redux/store";
import { inToCm, cmToIn } from "../utils/converters";

export default function PrecipitationDetails({ details }) {
  const [precipitationUnit, setPrecipitationUnit] = useState("cm");

  useEffect(() => {
    setUnitType();

    const unsubscribe = store.subscribe(() => {
      setUnitType();
    });

    return unsubscribe;
  }, []);

  const setUnitType = () => {
    const { units } = store.getState();

    if (units.precipitation !== precipitationUnit) {
      setPrecipitationUnit(units.precipitation);
    }
  };

  const getPrecipitationProbabilityWithHours = (details) => {
    let probs = "";
    const {
      RainProbability,
      SnowProbability,
      IceProbability,
      HoursOfRain,
      HoursOfSnow,
      HoursOfIce
    } = details;

    if (RainProbability) {
      probs += `${RainProbability}% rain`;
      if (HoursOfRain) {
        probs += ` (${HoursOfRain}h)`;
      }
    }
    if (SnowProbability) {
      const snowStr = `${SnowProbability}% snow`;
      probs += probs !== "" ? `, ${snowStr}` : snowStr;
      if (HoursOfSnow) {
        probs += ` (${HoursOfSnow}h)`;
      }
    }
    if (IceProbability) {
      const iceStr = `${IceProbability}% ice`;
      probs += probs !== "" ? `, ${iceStr}` : iceStr;
      if (HoursOfIce) {
        probs += ` (${HoursOfIce}h)`;
      }
    }

    return probs;
  };

  const getLiquid = (liquid) => {
    switch (liquid.Unit) {
      case "in":
        if (precipitationUnit === "cm") {
          return `${inToCm(liquid.Value).toFixed(1)} cm`;
        } else {
          return `${liquid.Value} in`;
        }
      case "cm":
        if (precipitationUnit === "in") {
          return `${cmToIn(liquid.Value).toFixed(1)} cm`;
        } else {
          return `${liquid.Value} in`;
        }
      default:
        return `${liquid.Value} ${liquid.Unit}`;
    }
  };

  const getAllLiquid = (rain, snow, ice) => {
    let liquids = "";
    if (rain.Value) {
      liquids += `${getLiquid(rain)} rain`;
    }
    if (snow.Value) {
      const snowStr = `${getLiquid(snow)} snow`;
      liquids += liquids !== "" ? `, ${snowStr}` : snowStr;
    }
    if (ice.Value) {
      const iceStr = `${getLiquid(ice)} ice`;
      liquids += liquids !== "" ? `, ${iceStr}` : iceStr;
    }
    return liquids !== "" ? `${liquids}` : "";
  };

  return (
    <div className="details-container">
      <div className="icon">
        <CloudRainIcon size={32} />
        {details.PrecipitationProbability}%
      </div>
      <div className="content">
        <div>Total hours: {details.HoursOfPrecipitation} h</div>
        <div>Total liquid: {getLiquid(details.TotalLiquid)}</div>
        <div>Cloud cover: {details.CloudCover}%</div>
        {details.ThunderstormProbability > 0 && (
          <div>Thunderstorm: {details.ThunderstormProbability}%</div>
        )}
        <div>{getPrecipitationProbabilityWithHours(details)}</div>
        <div>{getAllLiquid(details.Rain, details.Snow, details.Ice)}</div>
      </div>
    </div>
  );
}
