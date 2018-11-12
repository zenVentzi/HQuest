import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import {
  EDIT_ANSWER,
  REMOVE_ANSWER,
  MOVE_ANSWER_POSITION,
  LIKE_ANSWER,
  COMMENT_ANSWER,
} from 'Mutations';

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
                      return (
                        <Mutation mutation={LIKE_ANSWER}>
                          {likeAnswer => {
                            return (
                              <Mutation mutation={COMMENT_ANSWER}>
                                {commentAnswer => {
                                  return children(
                                    editAnswer,
                                    removeAnswer,
                                    moveAnswerPosition,
                                    likeAnswer,
                                    commentAnswer
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
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default AnsweredQuestionsGql;
