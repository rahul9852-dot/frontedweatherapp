import React from 'react';
import LocationResultItem from './LocationResultItem';

import './LocationResultList.scss';

export default function LocationResultList({ results, onLocationClicked }) {
  return (
    <div className="result-list">
      {results.map(result => (
        <LocationResultItem
          onLocationClicked={onLocationClicked}
          key={result.annotations.DMS.lat}
          location={result}
        />
      ))}
    </div>
  );
}
