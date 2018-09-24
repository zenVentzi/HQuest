import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { EDIT_ANSWER, REMOVE_ANSWER } from 'Mutations';

class AnsweredQuestionsGql extends Component {
  render() {
    const { children } = this.props;

    return (
      <Mutation mutation={EDIT_ANSWER}>
        {editAnswer => {
          return (
            <Mutation mutation={REMOVE_ANSWER}>
              {removeAnswer => {
                return children(editAnswer, removeAnswer);
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default AnsweredQuestionsGql;
