const initialState = {
    isDarkMode: false,
    isCelsius: false,
    cityWeather: null,
    error: ''
}

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            return { ...state, cityWeather: { ...state.cityWeather, isFavorite: !state.cityWeather.isFavorite } };
        case 'TOGGLE_DEGREE':
            return { ...state, isCelsius: !state.isCelsius };
        case 'TOGGLE_DARK_MODE':
            return { ...state, isDarkMode: !state.isDarkMode };
        case 'SET_CITY_WEATHER':
            return { ...state, cityWeather: { ...action.cityWeather } };
        case 'SET_ERROR':
            return { ...state, error: { ...action.error } };
        default:
            return state
    }
}