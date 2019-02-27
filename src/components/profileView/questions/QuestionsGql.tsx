import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_ANSWERED_QUESTIONS, GET_UNANSWERED_QUESTIONS } from 'Queries';

class QuestionsGql extends Component {
  render() {
    const { user, showAnswered, children } = this.props;
    const { selectedTags } = this.state;

    const vars = { userId: user.id, tags: selectedTags };

    const query = showAnswered
      ? GET_ANSWERED_QUESTIONS
      : GET_UNANSWERED_QUESTIONS;

    return (
      <Query query={query} variables={vars} fetchPolicy="cache-and-network">
        {({ loading, error, data: { questions } }) => {
          // return (<Mutation>{}</Mutation>);
          return children(loading, error, questions);
        }}
      </Query>
    ); // move the queries here?
  }
}

export default QuestionsGql;
