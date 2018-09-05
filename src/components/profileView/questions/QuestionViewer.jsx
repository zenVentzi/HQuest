import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Answer from './Answer';
import QuestionText from './QuestionText';
import update, { CACHE_ACTIONS } from './CacheQuestions';
import Reactions from './FloatingPanels/Reactions';
import Comments from './FloatingPanels/Comments';

const REMOVE_ANSWER = gql`
  mutation removeAnswer($answerId: ID!) {
    removeAnswer(answerId: $answerId) {
      userId
      questionId
    }
  }
`;

const Span = styled.span`
  cursor: pointer;
  margin: 1em 0.6em;
  font-size: 0.7em;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
  }
`;

class QuestionViewer extends Component {
  state = { showComments: false, showReactions: false };

  onClickRemove = mutate => async () => {
    mutate({
      variables: {
        answerId: this.props.question.answer.id,
      },
      update: update(CACHE_ACTIONS.REMOVE_ANSWER),
    });
  };

  toggleReactions = () => {
    this.setState(prevState => ({
      ...prevState,
      showReactions: !prevState.showReactions,
    }));
  };
  toggleComments = () => {
    this.setState(prevState => ({
      ...prevState,
      showComments: !prevState.showComments,
    }));
  };

  render() {
    return (
      <Mutation mutation={REMOVE_ANSWER}>
        {removeQuestion => {
          const {
            hovered,
            onClickEdit,
            /* showButtons */ question,
          } = this.props;
          const { showReactions, showComments } = this.state;
          const answerId = question.answer.id;

          return (
            <Fragment>
              {showComments && (
                <Comments answerId={answerId} onClose={this.toggleComments} />
              )}
              {showReactions && <Reactions onClose={this.toggleReactions} />}
              <QuestionText> {question.question} </QuestionText>
              <Answer viewMode question={question} />
              <div>
                <Span onClick={this.toggleReactions}>15 Reactions</Span>
                <Span onClick={this.toggleComments}>2 Comments</Span>
              </div>
              {/* showButtons */ true && (
                <div>
                  <Btn onClick={onClickEdit} visible={hovered}>
                    Edit
                  </Btn>
                  <Btn
                    onClick={this.onClickRemove(removeQuestion)}
                    visible={hovered}
                  >
                    Remove
                  </Btn>
                </div>
              )}
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default QuestionViewer;
