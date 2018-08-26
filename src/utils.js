import createHistory from 'history/createBrowserHistory';
import { AUTH_TOKEN, USER_ID } from './constants';

const history = createHistory();

function loggedUserToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

function isAuthenticated() {
  return loggedUserToken() !== null;
}

function loggedUserId() {
  return localStorage.getItem(USER_ID);
}

export { history, isAuthenticated, loggedUserId, loggedUserToken };
