import {
  INVALIDATE_USERS,
  REQUEST_USERS,
  RECEIVE_USERS,
} from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  items: [],
};


function users(state = initialState, action) {
  const newState = {
    ...state,
  };

  switch (action.type) {
    case REQUEST_USERS:
      newState.isFetching = true;
      break;
    case RECEIVE_USERS:
      newState.items = action.users;
      break;
    default:
  }
  return newState;
}

export default users;
