import createBrowserHistory from 'history/createBrowserHistory';
import { AUTH_TOKEN, USER_ID } from './constants';

const history = createBrowserHistory();

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

const getLoggedUserId = () => {
  const userId = localStorage.getItem(USER_ID);
  // console.log('TCL: getLoggedUserId -> userId', userId);
  return userId;
};

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
  getAuthToken,
  getLoggedUserId,
  overrideTheme,
  inverseColor,
  inverseTheme,
};
