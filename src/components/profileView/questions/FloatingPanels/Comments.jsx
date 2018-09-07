import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Comment from './Comment';
import FixedPanel from './FixedPanel';
import CommentsPanel from './CommentsPanel';

const ADD_COMMENT = gql`
  mutation addComment($answerId: ID!, $comment: String!) {
    addComment(answerId: $answerId, comment: $comment) {
      id
      user {
        id
        fullName
        intro
        avatarSrc
        me
      }
      comment
    }
  }
`;

const GET_COMMENTS = gql`
  query comments($answerId: ID!) {
    comments(answerId: $answerId) {
      id
      user {
        id
        fullName
        intro
        avatarSrc
        me
      }
      comment
    }
  }
`;

export { ADD_COMMENT, GET_COMMENTS };

const Input = styled.textarea`
  /* margin-top: 2em; */
  width: 80%;
  min-height: min-content;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

class Comments extends Component {
  state = { enteredComment: undefined };

  shouldComponentUpdate() {
    return false;
  }

  onKeyPress = addComment => async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const { answerId } = this.props;
      const { enteredComment } = this.state;
      await addComment({ variables: { answerId, comment: enteredComment } });
      // this.setState({ enteredComment: undefined });
      this.input.value = '';
      this.forceUpdate();
    }
  };

  onInputClick = e => {
    e.stopPropagation();
  };

  onChange = e => {
    this.setState({ enteredComment: e.target.value });
  };

  updateCache = (cache, { data: { addComment } }) => {
    const vars = { answerId: this.props.answerId };
    const { comments: cments } = cache.readQuery({
      query: GET_COMMENTS,
      variables: vars,
    });

    cache.writeQuery({
      query: GET_COMMENTS,
      variables: vars,
      data: { comments: cments.concat([addComment]) },
    });
  };

  renderComments = comments => {
    if (!comments.length) return <div> No comments yet </div>;
    const res = [];
    const copy = comments.slice();
    // console.log(copy);
    while (copy.length) {
      const com = copy.pop();
      res.push(<Comment key={com.id} comment={com} />);
    }
    return res;
  };

  render() {
    const { answerId, onClose } = this.props;

    return (
      <Query query={GET_COMMENTS} variables={{ answerId }}>
        {({ loading, error, data: { comments } }) => (
          <Mutation mutation={ADD_COMMENT} update={this.updateCache}>
            {addComment => {
              if (loading) return <div> Loading comments..</div>; // this should be below Input component
              if (error) return <div> {error.message} </div>;

              return (
                <CommentsPanel onClose={onClose}>
                  <Input
                    innerRef={ref => {
                      this.input = ref;
                    }}
                    placeholder="Add a comment..."
                    onKeyPress={this.onKeyPress(addComment)}
                    onChange={this.onChange}
                    onClick={this.onInputClick}
                  />
                  {this.renderComments(comments)}
                </CommentsPanel>
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }
}

export default Comments;
