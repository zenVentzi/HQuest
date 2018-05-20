import { combineReducers } from 'redux';
import questions from './Questions';
import users from './Users';

export default combineReducers({
  questions, users,
});
