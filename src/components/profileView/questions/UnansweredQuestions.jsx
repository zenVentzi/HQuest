import React, { Component } from 'react';
import QuestionEditor from './QuestionEditor';
import QuestionsQuery from './QuestionsQuery';

// eslint-disable-next-line react/prefer-stateless-function
class UnansweredQuestions extends Component {
  render() {
    const { userId } = this.props;

    return (
      <QuestionsQuery answered={false} userId={userId}>
        {questions => {
          if (!questions.length) {
            return <div> Congrats. All questions are answered </div>;
          }
          const q = questions[0];

          return <QuestionEditor userId={userId} question={q} />;
        }}
      </QuestionsQuery>
    );
  }
}

export default UnansweredQuestions;
