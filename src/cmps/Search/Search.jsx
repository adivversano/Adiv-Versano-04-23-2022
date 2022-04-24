import './Search.scss';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSetError, setCityWeather } from '../../store/actions/app.actions';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { weatherService } from '../../services/weather.service';
import debounce from 'lodash.debounce';
import { isEnglish } from '../../services/utils.service';

export const Search = () => {
    const { isDarkMode } = useSelector(state => state.appModule);
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');
    const [cities, setCities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => setError(''), 3500);
        return () => {
            clearTimeout(timeoutId)
        }
    }, [error]);

    const handleChange = ({ target }) => {
        const { value } = target;
        if (value && !isEnglish(value)) {
            setError('Please type in english only.');
            return;
        }
        setKeyword(value);
        if (!value) {
            setCities([]);
            return;
        }
        debouncedAutoComplete(value);
    }


    const onSetCityWeather = (city = cities[0]) => {
        debouncedAutoComplete.cancel();
        dispatch(setCityWeather(city))
        setCities([]);
        setIsOpen(false);
        setKeyword('');
    }

    const onAutoComplete = async (value) => {
        try {
            const cities = await weatherService.getCities(value);
            setCities(cities);
        } catch (error) {
            dispatch(onSetError(error))
        }
    }

    const debouncedAutoComplete = useMemo(() =>
        debounce(onAutoComplete, 250),
        []
    );

    return (
        <div
            className={`search-container${isOpen && cities.length > 0 ? ' open' : ''}${isDarkMode ? ' dark' : ''}`}
            onBlur={() => setIsOpen(false)}>
            {error && <span className="error">{error}</span>}
            <div className="input-container">
                <SearchIcon />
                <input
                    className={`search${isOpen && cities.length <= 0 ? ' focused' : ''}`}
                    type="text"
                    spellCheck="false"
                    value={keyword}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={ev => ev.code === 'Enter' && onSetCityWeather()}
                    placeholder="Search"
                />
            </div>
            <ul
                className={`auto-complete-container clean-list${isOpen ? ' show' : ''}`}
                onMouseDown={ev => ev.preventDefault()}>
                {cities.length > 0 && cities.map(city => {
                    const { key, name, country } = city;

                    const highlighted = name.substring(0, keyword.length);
                    const remnant = name.substring(keyword.length, name.length);

                    return <li key={key} onClick={() => onSetCityWeather(city)}>
                        <span className="bold">{highlighted}</span>{`${remnant}, ${country.code}`}
                    </li>
                })}
            </ul>
        </div >
    )
}
