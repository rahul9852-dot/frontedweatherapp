import { combineReducers } from 'redux';
import units from './units';
import forecast from './forecast';
import locations from './locations';

export default combineReducers({ units, forecast, locations });
