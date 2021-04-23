import React from 'react';

import './LocationResultItem.scss';

export default function LocationResultItem({ location, onLocationClicked }) {
  const onLocationItemClicked = location => {
    const { geometry, formatted, annotations, components } = location;
    onLocationClicked({ geometry, formatted, annotations, components });
  };

  return (
    <div
      className="location-item"
      onClick={() => onLocationItemClicked(location)}
    >
      <span>
        {location.formatted} {location.annotations.flag}
      </span>
    </div>
  );
}
