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

const isPersonal = userId => loggedUserId === userId;

const getTheme = neww => current => {
  const res = { ...current, ...neww };
  return res;
};

const inverseColor = color => {
  return color === 'white' ? 'black' : 'white';
};

export {
  history,
  isAuthenticated,
  loggedUserId,
  loggedUserToken,
  isPersonal,
  getTheme,
  inverseColor,
};
