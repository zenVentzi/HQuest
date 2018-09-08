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

const overrideTheme = neww => current => {
  const res = { ...current, ...neww };
  return res;
};

const inverseColor = color => {
  return color === 'white' ? 'black' : 'white';
};

const inverseTheme = theme => {
  const backgroundColor = inverseColor(theme.backgroundColor);
  const foregroundColor = inverseColor(theme.foregroundColor);
  return { ...theme, backgroundColor, foregroundColor };
};

export {
  history,
  isAuthenticated,
  loggedUserId,
  loggedUserToken,
  isPersonal,
  overrideTheme,
  inverseColor,
  inverseTheme,
};
