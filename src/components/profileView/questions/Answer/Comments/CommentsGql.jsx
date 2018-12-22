import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { COMMENT_ANSWER, EDIT_COMMENT, REMOVE_COMMENT } from 'Mutations';

class CommentsGql extends Component {
  render() {
    const { children } = this.props;

    return (
      <Mutation mutation={COMMENT_ANSWER}>
        {commentAnswer => {
          return (
            <Mutation mutation={EDIT_COMMENT}>
              {editComment => {
                return (
                  <Mutation mutation={REMOVE_COMMENT}>
                    {removeComment => {
                      return children(
                        commentAnswer,
                        editComment,
                        removeComment
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

export default CommentsGql;
