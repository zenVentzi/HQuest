import createBrowserHistory from 'history/createBrowserHistory';
import { AUTH_TOKEN, USER_ID } from './constants';

const history = createBrowserHistory();

function loggedUserToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

function isAuthenticated() {
  return loggedUserToken() !== null;
}

function loggedUserId() {
  return localStorage.getItem(USER_ID);
}

const getTheme = neww => current => ({ ...current, ...neww });

export { history, isAuthenticated, loggedUserId, loggedUserToken, getTheme };
