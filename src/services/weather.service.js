
import { httpService } from './http.service'
import { formatCityRes, formatFiveDaysForecastRes, formatHourlyForecastRes } from './utils.service'

export const weatherService = {
    getCityWeather,
    getFiveDaysForecast,
    getCities,
    updateCurrForecast,
    updateCurrForecasts,
    getByGeoLocation
}

// const API_KEY = 'hnjILShjEKCIQKW6iLc1xzfu7lJX3v5l';
// const API_KEY = 'mS8GndWiOSDChHVZpD51kvetaZTQk8hi';
const API_KEY = 'njjhxkKNmjb5c1GJByDU8G391PWeZiqR';


async function getCityWeather(cityName = 'Tel Aviv') {
    try {
        const cityWeather = (await getCities(cityName))[0];
        cityWeather.fiveDaysForecast = await getFiveDaysForecast(cityWeather?.key);
        return cityWeather;
    } catch (err) {
        if (err.response || err.request) {
            throw { msg: 'There is a problem communicating with the API.' };
        } else {
            throw err
        }
    }
}

async function updateCurrForecasts(favorites) {
    try {
        if (!favorites || !favorites.length) return;

        const favoritesToUpdate = favorites.filter(favorite => {
            return (favorite?.lastUpdated || (favorite?.lastUpdated + (1000 * 60 * 60) <= Date.now()));
        })
        const updatedFavorites = await favoritesToUpdate.map(async favoriteToUpdate => {
            favoritesToUpdate = await updateCurrForecast(favoriteToUpdate);
            return favoriteToUpdate;
        })

        return Promise.all(updatedFavorites);
    } catch (err) {
        if (err.response || err.request) {
            throw { msg: 'There is a problem communicating with the API.' };
        } else {
            throw err
        }
    }
}

async function updateCurrForecast(favorite) {
    try {
        if (!(favorite?.lastUpdated || !(favorite?.lastUpdated + (1000 * 60 * 60) <= Date.now()))) return favorite;

        const hourlyForecastRes = await httpService.get(`forecasts/v1/hourly/1hour/${favorite?.key}?apikey=${API_KEY}`);
        const hourlyForecast = formatHourlyForecastRes(hourlyForecastRes[0]);
        favorite.currWeather = { lastUpdated: Date.now(), hourlyForecast };
        return favorite;
    } catch (err) {
        if (err.response || err.request) {
            throw { msg: 'There is a problem communicating with the API.' };
        } else {
            throw err
        }
    }
}

async function getFiveDaysForecast(cityKey) {
    try {
        const fiveDayForecastRes = await httpService.get(`forecasts/v1/daily/5day/${cityKey}?apikey=${API_KEY}`);
        return formatFiveDaysForecastRes(fiveDayForecastRes);
    } catch (err) {
        if (err.response || err.request) {
            throw { msg: 'There is a problem communicating with the API.' };
        } else {
            throw err
        }
    }
}

async function getCities(keyword) {
    try {
        const citiesRes = await httpService.get(`locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${keyword}`);
        if (!citiesRes.length) throw { msg: 'No city found.' };
        return citiesRes.map(cityRes => formatCityRes(cityRes));
    } catch (err) {
        if (err.response || err.request) {
            throw { msg: 'There is a problem communicating with the API.' };
        } else {
            throw err
        }
    }
}

async function getByGeoLocation({ latitude, longitude }) {
    try {
        const cityRes = await httpService.get(`locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${latitude},${longitude}`);
        const cityWeather = formatCityRes(cityRes);
        cityWeather.fiveDaysForecast = await getFiveDaysForecast(cityWeather?.key);
        return cityWeather;
    } catch (err) {
        if (err.response || err.request) {
            throw { msg: 'There is a problem communicating with the API.' };
        } else {
            throw err
        }
    }
}
