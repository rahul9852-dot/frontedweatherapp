import React from "react";
import { Moon as MoonIcon } from "react-feather";
import RiseSet from "./RiseSet";

export default function MoonDetails({ moonRise, moonSet, moonPhase, moonAge }) {
  const getPhaseName = () => {
    // https://www.almanac.com/astronomy/moon/calendar
    switch (moonPhase) {
      case "New":
        return "New Moon";
      case "First":
        return "First Quarter";
      case "WaxingCrescent":
        return "Waxing Crescent";
      case "WaxingGibbous":
        return "Waxing Gibbous";
      case "Full":
        return "Full Moon";
      case "WaningGibbous":
        return "Waning Gibbous";
      case "Last":
        return "Last Quarter";
      case "WaningCrescent":
        return "Waning Crescent";
      default:
        return `TODO: ${moonPhase}`;
    }
  };
  return (
    <div className="details-container">
      <div className="icon">
        <MoonIcon size={32} />
      </div>
      <div className="content">
        <span>Phase: {getPhaseName()}</span>
        <span>Age: {moonAge} days</span>
        <br />
        <RiseSet showIcon={false} rise={moonRise} set={moonSet}>
          <MoonIcon size={18} />
        </RiseSet>
      </div>
    </div>
  );
}
