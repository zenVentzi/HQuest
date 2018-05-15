import { CLEAR_ANSWER, EDIT_ANSWER } from '../actions/actionTypes';

const initialState = {
  questions: {
    byId: {
      1: {
        payload: 'How much do you... ?',
        answerType: 'rating',
        answer: 7,
      },
      2: {
        payload: 'How much do you...(1) ?',
        answerType: 'rating',
        answer: 2,
      },
    },
    allIds: [1, 2],
  },
};

function editAnswer(state, id, answer) {
  const newState = {
    ...initialState,
    questions: {
      ...initialState.questions,
      byId: {
        ...initialState.questions.byId,
        1: { ...initialState.questions.byId[id], answer },
      },
    },
  };

  return newState;
}

function questions(state = initialState, action) {
  // console.log(action.type);

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
