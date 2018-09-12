import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_ANSWERED_QUESTIONS, GET_UNANSWERED_QUESTIONS } from 'Queries';
import AnsweredQuestions from './AnsweredQuestions';
import QuestionTags from './QuestionTags';
import UnansweredQuestions from './UnansweredQuestions';

class QuestionsContainer extends Component {
  state = { selectedTags: [] };

  onSelectedTags = tags => {
    this.setState(prev => {
      return { ...prev, selectedTags: tags };
    });
  };

  render() {
    const { user, showAnswered } = this.props;
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
            if (loading) return <div> loading questions.. </div>;
            if (error) return <div> {`Error ${error}`}</div>;

            return showAnswered ? (
              <AnsweredQuestions isPersonal={user.me} questions={questions} />
            ) : (
              <UnansweredQuestions questions={questions} />
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default QuestionsContainer;
