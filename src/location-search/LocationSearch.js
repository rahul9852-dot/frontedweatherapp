import React, { useEffect, useRef, useReducer, useState } from "react";
import useDebounce from "../utils/useDebounce";
import LocationResultList from "./LocationResultList";
import { getLocattionByCityName } from "../services/OpenCageService";
import { connect } from "react-redux";
import { setLocation } from "../redux/actions";
import {
  SET_SEARCH_TERM,
  SET_RESULTS,
  SHOW_RESULTS
} from "../local-state/location-search/location-search-actions";
import {
  reducer,
  initialState
} from "../local-state/location-search/location-search-reducer";

import "./LocationSearch.scss";

function LocationSearch(props) {
  const node = useRef();
  const [disableResults, setDisableResults] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { searchTerm, results, showResults } = state;
  const { locations } = props;
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (
      locations &&
      locations.currentLocation &&
      locations.currentLocation.name
    ) {
      setDisableResults(true);
      dispatchLocalAction(SET_SEARCH_TERM, locations.currentLocation.name);
    }
  }, []);

  useEffect(() => {
    props.onSearchTermEmpty(!debouncedSearchTerm);
    if (!disableResults) {
      if (debouncedSearchTerm) {
        // load location results from store if possible
        if (locations && locations.locations[debouncedSearchTerm]) {
          console.log(
            "loading location results from store for:",
            debouncedSearchTerm
          );
          dispatchLocalAction(
            SET_RESULTS,
            locations.locations[debouncedSearchTerm]
          );
        } else {
          // get location results from api
          console.log(
            "get location results from api for:",
            debouncedSearchTerm
          );
          getLocation(debouncedSearchTerm);
        }
      } else {
        if (showResults) {
          dispatchLocalAction(SHOW_RESULTS, false);
        }
      }
    } else {
      setDisableResults(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  const onLocationListClicked = (details) => {
    dispatchLocalAction(SHOW_RESULTS, false);
    props.onLocationClicked(details);
  };

  const handleClickOutside = (event) => {
    if (node.current.contains(event.target)) {
      return;
    }
    dispatchLocalAction(SHOW_RESULTS, false);
  };

  const getLocation = (term) => {
    getLocattionByCityName(term)
      .then((res) => {
        dispatchLocalAction(SET_RESULTS, res.results);

        props.setLocation({
          term: debouncedSearchTerm.toLowerCase(),
          results: res.results
        });
      })
      .catch((err) => console.error(err));
  };

  const onInputClicked = () => {
    if (searchTerm && !showResults && results && results.length > 0) {
      dispatchLocalAction(SHOW_RESULTS, true);
    }
  };

  const dispatchLocalAction = (type, payload) => {
    dispatch({
      type,
      payload
    });
  };

  return (
    <div className="location-search-container">
      <div className="input-wrapper">
        <input
          placeholder="New York"
          value={searchTerm}
          onFocus={onInputClicked}
          onChange={(event) =>
            dispatchLocalAction(SET_SEARCH_TERM, event.target.value)
          }
        />
      </div>
      {results && results.length > 0 && showResults && (
        <div className="result-wrapper" ref={node}>
          <LocationResultList
            results={results}
            onLocationClicked={onLocationListClicked}
          />
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  const { locations } = state;
  return { locations };
}

export default connect(mapStateToProps, { setLocation })(LocationSearch);
