import './Header.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleDarkMode, toggleDegree } from '../../store/actions/app.actions';
import { ReactComponent as SunIcon } from '../../assets/sun-icon.svg'
import { ReactComponent as LightIcon } from '../../assets/light-icon.svg';
import { ReactComponent as DarkIcon } from '../../assets/dark-icon.svg';
export const Header = () => {
    const dispatch = useDispatch();
    const { isCelsius, isDarkMode } = useSelector(state => state.appModule);

    const onToggleDegree = () => {
        dispatch(toggleDegree());
    }
    const onToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    }
    return (
        <header className="full main-container">
            <div className="header-wrapper flex align-center justify-between">
                <div className="logo">
                    <div className="icon">
                        <SunIcon />
                    </div>
                    <span>
                        Weather
                    </span>
                </div>

                <nav>
                    <div className="btns-container">
                        <button className={`toggle-degree-btn clean-btn`} onClick={onToggleDegree}>
                            {isCelsius ?
                                <span>°f</span>
                                :
                                <span>°c</span>
                            }
                        </button>
                        <button className={`dark-mode-btn${isDarkMode ? ' dark' : ''}`} onClick={onToggleDarkMode}>
                            {isDarkMode ?
                                <LightIcon />
                                :
                                <DarkIcon />
                            }
                        </button>
                    </div>
                    <Link to="/"><span>Home</span></Link>
                    <Link to="/favorites"><span>Favorites</span></Link>
                </nav>
            </div>
        </header >
    )
}
