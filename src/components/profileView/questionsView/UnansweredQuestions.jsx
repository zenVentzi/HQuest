import React, { Component } from 'react';
import Question from './Question';
import QuestionsQuery from './QuestionsQuery';

class UnansweredQuestions extends Component {
  state = {
    index: 0,
  };

  render() {
    const { userId } = this.props;

    return (
      <QuestionsQuery answered={false} userId={userId}>
        {questions => {
          const q = questions[0];

          return <Question userId={userId} question={q} onSave={this.onSave} />;
        }}
      </QuestionsQuery>
    );
  }
}

export default UnansweredQuestions;
