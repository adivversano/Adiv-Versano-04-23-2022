import './Favorites.scss';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '../../services/custom-hooks/useLocalStorage';
import { getDeg } from '../../services/utils.service';
import { weatherService } from '../../services/weather.service';
import { Link } from 'react-router-dom';
import { onSetError } from '../../store/actions/app.actions';

export const Favorites = () => {
    const dispatch = useDispatch();
    const [favorites, setFavorites] = useLocalStorage('favorites', []);
    const { isCelsius, isDarkMode } = useSelector(state => state.appModule);

    useEffect(() => {
        updateFavoritesCurrForecasts();
    }, [])


    const updateFavoritesCurrForecasts = async () => {
        try {
            const updatedFavorites = await weatherService.updateCurrForecasts(favorites);
            if (!updatedFavorites || !updatedFavorites.length) return;
            setFavorites(updatedFavorites);
        } catch (error) {
            dispatch(onSetError(error))
        }
    }

    return (
        <div className={`favorites${isDarkMode ? ' dark' : ''}`}>
            <h1 className="title">Favorites:</h1>
            <ul className="favorites-list clean-list">
                {favorites.map((favorite, idx) => {
                    const { key, name, currWeather: { hourlyForecast } } = favorite;
                    const { iconUrl, text, temperature } = hourlyForecast;
                    return <Link key={key} to={`/${key}`}>
                        <li className="flex align-center column" style={{
                            animation: `fade-in 0.2s ease-in ${(idx + 1) / 5}s forwards, move-down 0.3s cubic-bezier(0.06, 0.91, 1, 1) ${(idx + 1) / 5}s forwards`
                        }}>
                            <img src={iconUrl} alt="" />
                            <p className="city">{name}</p>
                            <p className="text">{text}</p>
                            <p>{getDeg(temperature, isCelsius)}</p>
                        </li>
                    </Link>
                })}
            </ul>
        </div >
    )
}
