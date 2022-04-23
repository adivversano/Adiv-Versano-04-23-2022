import './Forecast.scss';
import { useDispatch, useSelector } from 'react-redux'
import { ReactComponent as HeartIcon } from '../../assets/heart.svg';
import { ReactComponent as FilledHeartIcon } from '../../assets/filled-heart.svg';
import { ForecastList } from '../ForecastList/ForecastList';
import { getAvgDeg } from '../../services/utils.service';
import { useLocalStorage } from '../../services/custom-hooks/useLocalStorage';
import { onSetError, toggleFavorite } from '../../store/actions/app.actions';
import { weatherService } from '../../services/weather.service';

export const Forecast = () => {
    const dispatch = useDispatch();
    const { isCelsius, isDarkMode } = useSelector(state => state.appModule);
    const [favorites, setFavorites] = useLocalStorage('favorites', []);
    const { cityWeather } = useSelector(state => state.appModule);
    const { key, name, isFavorite, country, fiveDaysForecast } = cityWeather;
    const { text, dailyForecasts } = fiveDaysForecast;

    const onToggleFavorite = async () => {
        try {
            //UPDATING REDUX
            dispatch(toggleFavorite());
            if (isFavorite) {
                //DELETING FROM STORAGE
                setFavorites(favorites.filter(favorite => {
                    return favorite?.key !== key
                }));
            } else {
                //SAVING TO STORAGE
                const cityWeatherToUpdate = { ...cityWeather };
                delete cityWeatherToUpdate.fiveDaysForecast;
                const updatedFavorite = await weatherService.updateCurrForecast(cityWeatherToUpdate);
                setFavorites([...favorites, updatedFavorite]);
            }
        } catch (error) {
            dispatch(onSetError(error))
        }
    }

    return (
        <section className={`forecast flex column justify-between align-center${isDarkMode ? ' dark' : ''}`}>
            <div className="forecast-info flex justify-between">
                <div className="info">
                    <h3>
                        {name}, {country.code}
                    </h3>
                    <span>
                        {getAvgDeg(dailyForecasts[0].temperature, isCelsius)}
                    </span>
                </div>
                {isFavorite ?
                    <FilledHeartIcon
                        className="favorite-btn filled"
                        onClick={onToggleFavorite}
                    /> :
                    <HeartIcon
                        className="favorite-btn"
                        onClick={onToggleFavorite}
                    />
                }
            </div>
            <p className="forecast-text" key={cityWeather?.key}>{text}</p>
            <ForecastList dailyForecasts={dailyForecasts} />
        </section>
    )
}
