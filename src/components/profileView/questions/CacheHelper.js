import { GET_QUESTIONS } from './index';

const ADD_QUESTION = 'editQuestion';
const REMOVE_QUESTION = 'removeQuestion';

export { ADD_QUESTION, REMOVE_QUESTION };

const updateQuestions = (
  userId,
  action,
  updateAnswered,
  store,
  mutatedQuestion
) => {
  const variables = { userId, answered: updateAnswered };

  const { questions } = store.readQuery({
    query: GET_QUESTIONS,
    variables,
  });

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

const update = (userId, action) => (
  store,
  { data: { [action]: mutatedQuestion } }
) => {
  try {
    updateQuestions(userId, action, false, store, mutatedQuestion);
  } catch (error) {} // eslint-disable-line no-empty

  updateQuestions(userId, action, true, store, mutatedQuestion);
};

export default update;
