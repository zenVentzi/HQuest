import React, { Component, Fragment } from 'react';
import Answer from './Answer';
import QuestionText from './QuestionText';

class QuestionEditor extends Component {
  state = {
    answerValue: this.props.question.answer
      ? this.props.question.answer.value
      : this.props.question.defaultAnswer,
  };

  onChange = editedAnswer => {
    const newState = { ...this.state, answerValue: editedAnswer };
    this.setState(newState);
    this.props.onChange(newState.answerValue);
  };

  render() {
    const { question } = this.props;

    return (
      <Fragment>
        <QuestionText> {question.question} </QuestionText>
        <Answer viewMode={false} question={question} onChange={this.onChange} />
      </Fragment>
    );
  }
}

export default QuestionEditor;
