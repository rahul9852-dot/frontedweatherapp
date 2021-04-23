import React from 'react';

export default function ApiSelect({ api, onApiChanged }) {
  return (
    <select value={api} onChange={onApiChanged}>
      <option value="openweather">OpenWeather (USA)</option>
      <option value="accuweather">AccuWeather (Global)</option>
    </select>
  );
}
