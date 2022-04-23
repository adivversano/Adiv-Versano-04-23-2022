import './ForecastList.scss';
import {useSelector} from 'react-redux';
import { getAvgDeg } from '../../services/utils.service';

export const ForecastList = ({ dailyForecasts }) => {
    const { isCelsius, isDarkMode } = useSelector(state => state.appModule);

    return (
        <ul className={`forecast-list clean-list${isDarkMode ? ' dark' : ''}`} key={dailyForecasts[0]?.date}>
            {dailyForecasts.map(({ date, temperature, day }, idx) => {
                const dayIdx = new Date(date).getDay();
                const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                return <li key={idx} className="flex align-center column">
                    <img src={day.iconUrl} alt="" />
                    <p className="day">{weekday[dayIdx]}</p>
                    <p>{getAvgDeg(temperature, isCelsius)}</p>
                </li>
            })}
        </ul>
    )
}
