import {
  CLEAR_ANSWER,
  EDIT_ANSWER,
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
