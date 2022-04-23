import { weatherService } from "../../services/weather.service";

// Dispatchers
const _setCityWeather = (cityWeather) => ({ type: 'SET_CITY_WEATHER', cityWeather });
const _toggleFavorite = () => ({ type: 'TOGGLE_FAVORITE' });
const _toggleDarkMode = () => ({ type: 'TOGGLE_DARK_MODE' });
const _toggleDegree = () => ({ type: 'TOGGLE_DEGREE' });
const _setError = (error) => ({ type: 'SET_ERROR', error });

// THUNK

export function loadCityWeather(coords) {
    return async dispatch => {
        try {
            let cityWeather;
            if (coords) cityWeather = await weatherService.getByGeoLocation(coords);
            else cityWeather = await weatherService.getCityWeather();
            dispatch(_setCityWeather(cityWeather));
        } catch (err) {
            dispatch(_setError(err))
        }
    }
}

export function setCityWeather(cityWeather) {
    return async dispatch => {
        try {
            if (!cityWeather?.fiveDaysForecast) {
                cityWeather.fiveDaysForecast = await weatherService.getFiveDaysForecast(cityWeather?.key);
            }
            dispatch(_setCityWeather(cityWeather));
        } catch (error) {
            dispatch(_setError(error))
        }
    }
}

export function toggleFavorite() {
    return dispatch => {
        dispatch(_toggleFavorite());
    }
}
export function toggleDegree() {
    return dispatch => {
        dispatch(_toggleDegree());
    }
}
export function toggleDarkMode() {
    return dispatch => {
        dispatch(_toggleDarkMode());
    }
}

export function onSetError(error) {
    return dispatch => {
        dispatch(_setError(error))
    }
}