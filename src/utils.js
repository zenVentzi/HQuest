import createHistory from 'history/createBrowserHistory';
import { AUTH_TOKEN } from './constants';

const history = createHistory();

function isAuthenticated(test) {
  if (test) {
    console.log(test);
  }
  return localStorage.getItem(AUTH_TOKEN) !== null;
}

export { history, isAuthenticated };
