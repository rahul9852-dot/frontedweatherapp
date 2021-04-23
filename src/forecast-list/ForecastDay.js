import React from 'react';
import ForecastCard from '../forecast-card/ForecastCard';
import AccuForecastCard from '../forecast-card/AccuForecastCard';

import './ForecastDay.scss';

export default function ForecastDay({ day, isAccuWeather, onDetailsClicked }) {
  return (
    <div className="forecast-day">
      {!isAccuWeather && (
        <>
          {day.night ? <ForecastCard forecast={day.night} /> : <span />}
          {day.day ? <ForecastCard forecast={day.day} /> : <span />}
        </>
      )}
      {isAccuWeather && (
        <>
          <AccuForecastCard
            forecast={day.night}
            isDay={false}
            onDetailsClicked={onDetailsClicked}
          />
          <AccuForecastCard
            forecast={day.day}
            isDay={true}
            onDetailsClicked={onDetailsClicked}
          />
        </>
      )}
    </div>
  );
}
