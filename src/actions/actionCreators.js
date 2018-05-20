import {
  CLEAR_ANSWER,
  EDIT_ANSWER,
  INVALIDATE_USERS,
  REQUEST_USERS,
  RECEIVE_USERS,
} from './actionTypes';

export function clearAnswer(id) {
  return {
    type: CLEAR_ANSWER,
    id,
  };
}

export const editAnswer = (id, answer) => (
  {
    type: EDIT_ANSWER,
    id,
    answer,
  });

export function invalidateUsers(users) {
  return {
    type: INVALIDATE_USERS,
    users,
  };
}

function requestUsers() {
  return {
    type: REQUEST_USERS,
  };
}

function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    users,
  };
}

export function fetchUsers(input) {
  return (dispatch) => {
    dispatch(requestUsers());

    // simulating fetch
    setTimeout(() => {
      const users = [
        { id: 1, name: `${input}Pesho`, avatarSrc: '' },
        { id: 2, name: `${input}Gsho`, avatarSrc: '' },
        { id: 3, name: `${input}Tsho`, avatarSrc: '' },
      ];

      dispatch(receiveUsers(users));
    }, 1000);
  };
}

// function shouldFetchUsers(state) {
//   if (state.users.isFetching) {
//     return false;
//   } else if (state.users.items.length === 0) {
//     return true;
//   }

//   return state.users.didInvalidate;
// }

// export function fetchUsersIfNeeded(input) {
//   return (dispatch, getState) => {
//     if (shouldFetchUsers(getState())) {
//       return dispatch(fetchUsers(input));
//     }

//     return Promise.resolve();
//   };
// }
