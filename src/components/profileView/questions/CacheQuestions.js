import { GET_QUESTIONS } from 'Queries';
// import { viewedProfileId as userId } from '../index';

const ADD_ANSWER = 'addAnswer';
// const EDIT_ANSWER = `editAnswer`;
const REMOVE_ANSWER = 'removeAnswer';

const CACHE_ACTIONS = { ADD_ANSWER, /* EDIT_ANSWER, */ REMOVE_ANSWER };

export { CACHE_ACTIONS };

const updateQuestions = (action, questions, mutatedAnswer) => {
  const { questionId } = mutatedAnswer;
  let questionObj;
  let questionIndex;

  switch (action) {
    // apollo seems to automatically update in this case, so leave it for now
    // case EDIT_ANSWER: {
    //   debugger;
    //   questionObj = questions.answered.find(q => q.id === questionId);
    //   questionObj.answer.value = mutatedAnswer.value;
    //   break;
    // }
    case ADD_ANSWER: {
      questionObj = questions.unanswered.find(q => q.id === questionId);
      questionIndex = questions.unanswered.findIndex(q => q.id === questionId);
      questions.unanswered.splice(questionIndex, 1);
      questionObj.answer = mutatedAnswer;
      questions.answered.push(questionObj);
      break;
    }
    case REMOVE_ANSWER: {
      questionObj = questions.answered.find(q => q.id === questionId);
      questionIndex = questions.answered.findIndex(q => q.id === questionId);
      questions.answered.splice(questionIndex, 1);
      delete questionObj.answer;
      questions.unanswered.push(questionObj);
      break;
    }
    default:
      break;
  }
};

// const update = action => (store, { data: { [action]: mutatedQuestion } }) => {
const update = action => (store, { data }) => {
  const mutatedAnswer = data[action];
  const variables = { userId: mutatedAnswer.userId, all: true };
  const { questions } = store.readQuery({
    query: GET_QUESTIONS,
    variables,
  });

  updateQuestions(action, questions, mutatedAnswer);

  store.writeQuery({
    query: GET_QUESTIONS,
    variables,
    data: { questions },
  });
};

export default update;
