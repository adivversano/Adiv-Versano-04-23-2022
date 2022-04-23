import { Home } from './views/Home/Home.jsx';
import { Favorites } from './views/Favorites/Favorites.jsx';

export const routes = [
    {
        path: '/favorites',
        element: <Favorites/>,
    },
    {
        path: '/:id',
        element: <Home />,
    },
    {
        path: '/',
        element: <Home />,
    }
]