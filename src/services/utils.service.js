export function formatCityRes(cityRes) {
    const {
        Key = '',
        EnglishName = '',
        LocalizedName = '',
        Country = null
    } = cityRes;
    const city = {
        key: Key,
        name: EnglishName || LocalizedName,
        country: {
            code: Country?.ID,
            name: Country?.EnglishName || Country?.LocalizedName
        },
        isFavorite: _isCityFavorite(Key)
    }
    return city;
}
export function formatFiveDaysForecastRes({
    Headline, DailyForecasts
}) {
    const {
        EffectiveDate = null,
        Text = '',
    } = Headline;

    const fiveDayForcast = {
        effectiveDate: EffectiveDate,
        text: Text,
        dailyForecasts: DailyForecasts.length ?
            DailyForecasts.map(DailyForecast => {
                const { Date = null, Temperature = null, Day = null, Night = null } = DailyForecast;
                return {
                    date: Date,
                    temperature: {
                        min: {
                            value: Temperature?.Minimum?.Value,
                            unit: Temperature?.Minimum?.Unit
                        },
                        max: {
                            value: Temperature?.Maximum?.Value,
                            unit: Temperature?.Maximum?.Unit
                        }
                    },
                    day: {
                        iconUrl: _getIconUrl(Day?.Icon),
                        description: Day?.IconPhrase
                    },
                    night: {
                        iconUrl: _getIconUrl(Night?.Icon),
                        description: Night?.IconPhrase
                    }
                }
            }) : []
    };
    return fiveDayForcast;
}
export function formatHourlyForecastRes(hourlyForecastRes) {
    const {
        Temperature = null,
        IconPhrase = '',
        WeatherIcon = 1,
    } = hourlyForecastRes;

    const hourlyForecast = {
        temperature: {
            value: Temperature?.Value,
            unit: Temperature?.Unit,
        },
        text: IconPhrase,
        iconUrl: _getIconUrl(WeatherIcon)
    }
    return hourlyForecast;
}
export function getDeg(temperature, isCelsius) {
    const { value, unit } = temperature;
    if (!value) return 0;
    let degree;
    if (isCelsius && unit === 'F') {
        degree = _convertDeg(value, 'c')
    } else if (unit === 'C') {
        degree = _convertDeg(value, 'f')
    } else {
        degree = value + '°f';
    }
    return degree;
}
export function getAvgDeg(temperature, isCelsius) {
    const { min = null, max = null } = temperature;
    if (!min || !max) return 0;
    let avgTempDeg = (min.value + max.value) / 2;
    if (isCelsius && min.unit === 'F') {
        avgTempDeg = _convertDeg(avgTempDeg, 'c')
    } else if (min.unit === 'C') {
        avgTempDeg = _convertDeg(avgTempDeg, 'f')
    } else {
        avgTempDeg += '°f';
    }
    return avgTempDeg;
}
export function isEnglish(string) {
    const englishReg = /^[a-zA-Z\s]*$/;
    return englishReg.test(string);
}

function _convertDeg(value, to) {
    if (to === 'c') {
        return Math.round((value - 32) / 1.8) + '°c'
    } else {
        return Math.round((value * 1.8) + 32) + '°f';
    }
}
function _getIconUrl(iconNum) {
    if (isNaN(iconNum)) return '';
    if (iconNum < 10) iconNum = `0${iconNum}`;
    return `https://developer.accuweather.com/sites/default/files/${iconNum}-s.png`
}
function _isCityFavorite(key) {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    if (!favorites || !favorites.length) return false;
    return favorites.some(favorite => favorite?.key === key);
}
