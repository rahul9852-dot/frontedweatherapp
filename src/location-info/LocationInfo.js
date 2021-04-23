import React, { useState } from "react";
import { XCircle as XCircleIcon } from "react-feather";
import MapDetails from "./MapDetails";
import CurrencyDetails from "./CurrencyDetails";
import CoordinatesDetails from "./CoordinatesDetails";
import LocationDetails from "./LocationDetails";
import TimezoneDetails from "./TimezoneDetails";
import CallDetails from "./CallDetails";
import RoadDetails from "./RoadDetails";

import "./LocationInfo.scss";

export default function LocationInfo({ location, isPinned, onPinClicked }) {
  const [showInfo, setShowInfo] = useState(false);

  const switchShowInfo = (event) => {
    event.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <div className="location-name" onClick={() => setShowInfo(true)}>
      {location.name}
      {showInfo && (
        <div className="info-card">
          <div className="name-wrapper">
            <span className="name">
              {location.name} {location.flag}
            </span>
            <button onClick={switchShowInfo}>
              <XCircleIcon size={22} color="#656565" />
            </button>
          </div>
          <button className="pin-button" onClick={() => onPinClicked()}>
            {isPinned ? "Unpin location" : "Pin location"}
          </button>
          <MapDetails osm={location.osm} />
          <CoordinatesDetails dms={location.dms} />
          <LocationDetails components={location.components} />
          <TimezoneDetails timezone={location.timezone} />
          <CurrencyDetails currency={location.currency} />
          <CallDetails callingcode={location.callingcode} />
          <RoadDetails roadinfo={location.roadinfo} />
        </div>
      )}
    </div>
  );
}
