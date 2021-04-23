import React from "react";
import { Map as MapIcon } from "react-feather";

export default function LocationDetails({ components }) {
  const getLocationString = (components) => {
    const str = `${components.continent}, ${components.country}(${components.country_code})`;
    const region = components.region ? ` - ${components.region}` : "";

    return `${str}${region}`;
  };

  return (
    <div className="info-block">
      <MapIcon size={24} />
      <div className="values">{getLocationString(components)}</div>
    </div>
  );
}
