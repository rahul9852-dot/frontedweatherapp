import React from "react";
import { getWeatherIcon } from "../services/AccuWeatherService";

const USE_MODERN_ICONS = true;

export default function DescriptionDetails({
  icon,
  iconPhrase,
  longPhrase,
  shortPhrase
}) {
  return (
    <>
      <div className="icon-and-description">
        <img
          className={USE_MODERN_ICONS ? "icon accu modern" : "icon accu"}
          src={getWeatherIcon(icon, USE_MODERN_ICONS)}
          alt={iconPhrase}
        />
        <div className="description">
          {longPhrase ? longPhrase : shortPhrase}
        </div>
      </div>
    </>
  );
}
