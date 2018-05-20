import { CLEAR_ANSWER, EDIT_ANSWER } from '../actions/actionTypes';

const initialState = {
  byId: {
    1: {
      question: 'How much do you... ?',
      answerType: 'rating',
      answer: 7,
    },
    2: {
      question: 'How much do you...(1) ?',
      answerType: 'rating',
      answer: 2,
    },
  },
  allIds: [1, 2],
};

function editAnswer(state, id, answer) {
  const newState = {
    ...state,
    byId: {
      ...state.byId,
      [id]: { ...state.byId[id], answer },
    },
  };

  return newState;
}

function questions(state = initialState, action) {
  switch (action.type) {
    case CLEAR_ANSWER: {
      return editAnswer(state, action.id, 0);
    }
    case EDIT_ANSWER: {
      return editAnswer(state, action.id, action.answer);
    }
    default:
      return state;
  }
}

export default questions;
