import GameDetailsPage from '../Pages/GameDetailsPage';
import HomePage from '../Pages/HomePage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import Logout from '../Logout/Logout';
import ChessPage from '../Pages/Chess';

const routes = {
  '/': HomePage,
  '/gameDetails': GameDetailsPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/logout': Logout,
  '/chess': ChessPage,
};

export default routes;
