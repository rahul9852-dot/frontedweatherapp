import React from "react";
import { XCircle as XCircleIcon, MapPin as MapPinIcon } from "react-feather";

import "./PinnedLocations.scss";

export default function PinnedLocations({
  pinnedLocations,
  removePinnedLocation,
  loadLocation
}) {
  let locations = [];

  const setLocation = () => {
    locations = [];
    const keys = Object.keys(pinnedLocations);
    for (let i = 0; i < keys.length; i++) {
      locations.push(pinnedLocations[keys[i]]);
    }
  };

  setLocation();

  return (
    <div className="pinned-locations-container">
      {locations && locations.length > 0 && (
        <div className="title">
          <MapPinIcon size={20} />
          Pinned locations
        </div>
      )}
      {locations.map((location) => (
        <div className="pinned-location-item" key={location.name}>
          <span onClick={() => loadLocation(location)}>{location.name}</span>
          <button onClick={() => removePinnedLocation(location.name)}>
            <XCircleIcon size={18} color="#545454" />
          </button>
        </div>
      ))}
    </div>
  );
}
