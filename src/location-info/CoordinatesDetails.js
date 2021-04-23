import React from "react";
import { MapPin as MapPinIcon } from "react-feather";

export default function CoordinatesDetails({ dms }) {
  return (
    <div className="info-block">
      <MapPinIcon size={24} />
      <div className="values">
        <span className="value">{dms.lat}</span>
        <span className="value">{dms.lng}</span>
      </div>
    </div>
  );
}
