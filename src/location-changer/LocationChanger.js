import React, { useState } from "react";
import LocationSearch from "../location-search/LocationSearch";
import ApiSelect from "../api-select/ApiSelect";
import PinnedLocations from "../pinned-locations/PinnedLocations";
import {
  XCircle as XCircleIcon,
  Globe as GlobeIcon,
  Map as MapIcon
} from "react-feather";

import "./LocationChanger.scss";

export default function LocationChanger({
  forecast,
  location,
  useAccuWeatherApi,
  onLocationClicked,
  onApiChanged,
  onRefreshWeatherClicked,
  pinnedLocations,
  removePinnedLocation,
  loadLocation
}) {
  const [showInputBar, setShowInputBar] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  const onSearchTermEmpty = (isEmpty) => {
    if (isEmpty !== disableButton) {
      setDisableButton(isEmpty);
    }
  };

  return (
    <>
      <div
        className="location-button"
        onClick={() => setShowInputBar(!showInputBar)}
      >
        Location
      </div>
      {showInputBar && (
        <div className="location-wrapper">
          <span>Location</span>
          <button
            className="close-button"
            onClick={() => setShowInputBar(!showInputBar)}
          >
            <XCircleIcon size={22} color="#656565" />
          </button>
          <div className="input-bar">
            <div className="input-line">
              <GlobeIcon size={20} />
              <ApiSelect
                api={useAccuWeatherApi ? "accuweather" : "openweather"}
                onApiChanged={onApiChanged}
              />
            </div>
            <div className="input-line">
              <MapIcon size={20} />
              <LocationSearch
                onLocationClicked={onLocationClicked}
                onSearchTermEmpty={onSearchTermEmpty}
              />
            </div>
            {forecast && location && (
              <button
                className="refresh-button"
                onClick={onRefreshWeatherClicked}
                disabled={disableButton}
              >
                Refresh weather
              </button>
            )}

            <div className="pinned-wrapper">
              <PinnedLocations
                pinnedLocations={pinnedLocations}
                removePinnedLocation={removePinnedLocation}
                loadLocation={loadLocation}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
