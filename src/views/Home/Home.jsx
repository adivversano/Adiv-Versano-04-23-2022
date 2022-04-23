import './Home.scss';
import { Forecast } from '../../cmps/Forecast/Forecast';
import { Search } from '../../cmps/Search/Search';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '../../services/custom-hooks/useLocalStorage';
import { useEffect } from 'react';
import { setCityWeather } from '../../store/actions/app.actions';

export const Home = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { cityWeather } = useSelector(state => state.appModule);
    const [favorites, setFavorites] = useLocalStorage('favorites', []);

    useEffect(() => {
        if (!id || cityWeather?.key === id || !favorites?.length) return;
        const cityWeatherToLoad = favorites.find(favorite => favorite.key === id);
        dispatch(setCityWeather(cityWeatherToLoad));
    }, [id])

    return (
        <div className="home flex align-center column">
            <Search />
            {cityWeather && <Forecast/>}
        </div>
    )
}
