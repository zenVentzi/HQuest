import React, { Component } from 'react';
import Question from './Question';
import QuestionsQuery from './QuestionsQuery';

class UnansweredQuestions extends Component {
  state = {
    index: 0,
  };

  onSave = () => {
    const index = this.state.index + 1;
    this.setState({ index });
  };

  render() {
    const { userId } = this.props;

    return (
      <QuestionsQuery answered={false} userId={userId}>
        {questions => {
          const { index } = this.state;
          const q = questions[index];

          return <Question userId={userId} question={q} onSave={this.onSave} />;
        }}
      </QuestionsQuery>
    );
  }
}

export default UnansweredQuestions;
