import { GET_QUESTIONS } from './index';
import { viewedProfileId as userId } from '../index';

const ADD_QUESTION = 'editQuestion';
const REMOVE_QUESTION = 'removeQuestion';

export { ADD_QUESTION, REMOVE_QUESTION };

const updateAnsweredQs = (action, aQs, mutatedQuestion) => {
  switch (action) {
    case ADD_QUESTION:
      aQs.push(mutatedQuestion);
      break;
    case REMOVE_QUESTION: {
      const removedQuestionId = mutatedQuestion.id;
      const i = aQs.findIndex(q => q.id === removedQuestionId);
      aQs.splice(i, 1);
      break;
    }
    default:
      break;
  }
};

const updateUnansweredQs = (action, uQs, mutatedQuestion) => {
  switch (action) {
    case ADD_QUESTION: {
      const addedQuestionId = mutatedQuestion.id;
      const i = uQs.findIndex(q => q.id === addedQuestionId);
      uQs.splice(i, 1);
      break;
    }
    case REMOVE_QUESTION: {
      uQs.push(mutatedQuestion);
      break;
    }
    default:
      break;
  }
};

const updateQuestions = (action, updateAnswered, store, mutatedQuestion) => {
  const variables = { userId, all: true };

  const { questions } = store.readQuery({
    query: GET_QUESTIONS,
    variables,
  });

  console.log(questions);

  return;

  switch (action) {
    case ADD_QUESTION:
      if (updateAnswered) {
        questions.push(mutatedQuestion);
      } else {
        const removedQuestionId = mutatedQuestion.id;
        const i = questions.findIndex(q => q.id === removedQuestionId);
        questions.splice(i, 1);
      }
      break;
    case REMOVE_QUESTION:
      if (updateAnswered) {
        const removedQuestionId = mutatedQuestion.id;
        const i = questions.findIndex(q => q.id === removedQuestionId);
        questions.splice(i, 1);
      } else {
        questions.push(mutatedQuestion);
      }
      break;
    default:
      break;
  }

  store.writeQuery({
    query: GET_QUESTIONS,
    variables,
    data: { questions },
  });
};

// const update = action => (store, { data: { [action]: mutatedQuestion } }) => {
const update = action => (store, { data }) => {
  const mutatedQuestion = data[action];
  // try {
  //   updateQuestions(userId, action, false, store, mutatedQuestion);
  // } catch (error) {} // eslint-disable-line no-empty

  const variables = { userId, all: true };

  const { questions } = store.readQuery({
    query: GET_QUESTIONS,
    variables,
  });

  updateAnsweredQs(action, questions.answered, mutatedQuestion);
  updateUnansweredQs(action, questions.unanswered, mutatedQuestion);

  store.writeQuery({
    query: GET_QUESTIONS,
    variables,
    data: { questions },
  });
};

export default update;
