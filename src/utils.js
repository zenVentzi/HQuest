import createHistory from 'history/createBrowserHistory';
import { AUTH_TOKEN, USER_ID } from './constants';

const history = createHistory();

function isAuthenticated() {
  return localStorage.getItem(AUTH_TOKEN) !== null;
}

function loggedUserId() {
  return localStorage.getItem(USER_ID);
}

export { history, isAuthenticated, loggedUserId };
