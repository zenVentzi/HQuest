import React, { Component } from 'react';
import Question from './Question';
import AnswerEditor from './Answer/AnswerEditor';

class UnansweredQuestions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  onSave = () => {
    const index = this.state.index + 1;
    this.setState({ index });
  };

  render() {
    const q = this.props.questions[this.state.index];
    return (
      <Question value={q.value}>
        <AnswerEditor type={q.type} onSave={this.onSave} />
      </Question>
    );
  }
}

export default UnansweredQuestions;
