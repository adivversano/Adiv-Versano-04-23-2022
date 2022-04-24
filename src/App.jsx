
import './styles/styles.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from './routes';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { loadCityWeather } from './store/actions/app.actions';
import { Header } from './cmps/Header/Header';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {

  const dispatch = useDispatch();
  const { error, isDarkMode } = useSelector(state => state.appModule);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        dispatch(loadCityWeather(pos.coords))
      }, () => {
        dispatch(loadCityWeather())
      });
    } else {
      dispatch(loadCityWeather())
    }
  }, [dispatch])

  useEffect(() => {
    if (!error) return;
    toast.error(error.msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, [error])

  return (
    <div className={`app main-container${isDarkMode ? ' dark' : ''}`}>
      <Header />

      <main>
        <Routes>
          {routes.map(route => {
            return <Route key={route.path} element={route.element} path={route.path} />
          })}
        </Routes>
      </main>

      <ToastContainer />
    </div>
  );
}
