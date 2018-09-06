import React from 'react';
import { Query } from 'react-apollo';
import { GET_ANSWERED_QUESTIONS, GET_UNANSWERED_QUESTIONS } from 'Queries';
import AnsweredQuestions from './AnsweredQuestions';
import UnansweredQuestions from './UnansweredQuestions';

const QuestionsContainer = ({ user, showAnswered }) => {
  const vars = { userId: user.id };
  const query = showAnswered
    ? GET_ANSWERED_QUESTIONS
    : GET_UNANSWERED_QUESTIONS;

  return (
    <Query query={query} variables={vars}>
      {({ loading, error, data: { questions } }) => {
        if (loading) return <div> loading questions.. </div>;
        if (error) return <div> {`Error ${error}`}</div>;

        return showAnswered ? (
          <AnsweredQuestions showButtons={user.me} questions={questions} />
        ) : (
          <UnansweredQuestions questions={questions} />
        );
      }}
    </Query>
  );
};

export default QuestionsContainer;
