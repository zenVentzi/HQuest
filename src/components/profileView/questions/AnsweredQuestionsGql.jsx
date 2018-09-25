import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { EDIT_ANSWER, REMOVE_ANSWER, MOVE_ANSWER_POSITION } from 'Mutations';

class AnsweredQuestionsGql extends Component {
  render() {
    const { children } = this.props;

    return (
      <Mutation mutation={EDIT_ANSWER}>
        {editAnswer => {
          return (
            <Mutation mutation={REMOVE_ANSWER}>
              {removeAnswer => {
                return (
                  <Mutation mutation={MOVE_ANSWER_POSITION}>
                    {moveAnswerPosition => {
                      return children(
                        editAnswer,
                        removeAnswer,
                        moveAnswerPosition
                      );
                    }}
                  </Mutation>
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default AnsweredQuestionsGql;
