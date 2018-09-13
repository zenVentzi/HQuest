import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_ANSWERED_QUESTIONS, GET_UNANSWERED_QUESTIONS } from 'Queries';
import AnsweredQuestions from './AnsweredQuestions';
import QuestionTags from './QuestionTags';
import UnansweredQuestions from './UnansweredQuestions';

class QuestionsGql extends Component {
  state = { selectedTags: [] };

  onSelectedTags = tags => {
    this.setState(prev => {
      return { ...prev, selectedTags: tags };
    });
  };

  onAddNewAnswer = (questionId, answerValue) => {};
  onEditAnswer = (answerId, answerValue) => {};

  render() {
    const { user, showAnswered, children } = this.props;
    const { selectedTags } = this.state;

    const vars = { userId: user.id, tags: selectedTags };
    const query = showAnswered
      ? GET_ANSWERED_QUESTIONS
      : GET_UNANSWERED_QUESTIONS;

    return (
      <Fragment>
        <QuestionTags onSelected={this.onSelectedTags} />
        <Query query={query} variables={vars} fetchPolicy="cache-and-network">
          {({ loading, error, data: { questions } }) => {
            return children(loading, error, questions);
          }}
        </Query>
      </Fragment>
    ); // move the queries here?
  }
}

export default QuestionsGql;
