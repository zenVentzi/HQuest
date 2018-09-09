import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Answer from './Answer';
import QuestionText from './QuestionText';
import update, { CACHE_ACTIONS } from './CacheQuestions';
import Reactions from './Panels/Reactions';
import Comments from './Panels/Comments';
import QuestionOptions from './QuestionOptions';

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

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

class QuestionViewer extends Component {
  state = { showComments: !this.props.collapseComments, showReactions: false };

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
        {removeAnswer => {
          const { showReactions, showComments } = this.state;
          const {
            hovered,
            isPersonal = true,
            onClickEdit,
            /* showButtons */ question,
          } = this.props;

          const { numOfComments } = question.answer;
          const commentBtnText =
            numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;
          const answerId = question.answer.id;

          return (
            <Fragment>
              <Row>
                <QuestionText> {question.question}</QuestionText>
                {isPersonal && (
                  <QuestionOptions
                    hideIcon={!hovered}
                    onClickEdit={onClickEdit}
                    onClickRemove={removeAnswer}
                  />
                )}
              </Row>
              <Answer viewMode question={question} />
              <Row>
                <Span onClick={this.toggleReactions}>15 Reactions</Span>
                <Span onClick={this.toggleComments}>{commentBtnText}</Span>
              </Row>
              {showComments && (
                <Comments answerId={answerId} onClose={this.toggleComments} />
              )}
              {showReactions && <Reactions onClose={this.toggleReactions} />}
              {/* showButtons */ false && (
                <div>
                  <Btn onClick={onClickEdit} visible={hovered}>
                    Edit
                  </Btn>
                  <Btn
                    onClick={this.onClickRemove(removeAnswer)}
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
