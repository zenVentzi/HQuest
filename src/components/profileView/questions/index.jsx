import React from 'react';
import { Query } from 'react-apollo';
import { GET_QUESTIONS } from 'Queries';
import AnsweredQuestions from './AnsweredQuestions';
import UnansweredQuestions from './UnansweredQuestions';

const QuestionsContainer = ({ user, showAnswered }) => {
  const vars = { userId: user.id, all: user.me };

  return (
    <Query query={GET_QUESTIONS} variables={vars}>
      {({ loading, error, data: { questions } }) => {
        if (loading) return <div> loading questions.. </div>;
        if (error) return <div> {`Error ${error}`}</div>;
        // not using object destructing cuz it didn't work at the time
        const qs = showAnswered ? questions.answered : questions.unanswered;

        return showAnswered ? (
          <AnsweredQuestions showButtons={user.me} questions={qs} />
        ) : (
          <UnansweredQuestions questions={qs} />
        );
      }}
    </Query>
  );
};

export default QuestionsContainer;
