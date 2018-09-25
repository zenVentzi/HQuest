import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import Editions from './Editions';
import PositionEditor from './PositionEditor';
import Answer from './Answer';
import QuestionText from './QuestionText';
import Reactions from './Panels/Reactions';
import Comments from './Panels/Comments';
import QuestionOptions from './QuestionOptions';

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
  state = {
    showComments: !this.props.collapseComments,
    showReactions: false,
    showEditions: false,
    showPositionEditor: false,
  };

  onMovePosition = async ({ newPosition }) => {
    await this.props.onMovePosition({ newPosition });
    // check for success or failure
    this.togglePositionEditor();
  };

  toggleComments = () => {
    this.setState(prevState => ({
      ...prevState,
      showComments: !prevState.showComments,
    }));
  };

  toggleReactions = () => {
    this.setState(prevState => ({
      ...prevState,
      showReactions: !prevState.showReactions,
    }));
  };

  togglePositionEditor = () => {
    this.setState(prevState => ({
      ...prevState,
      showPositionEditor: !prevState.showPositionEditor,
    }));
  };

  toggleEditions = () => {
    this.setState(prevState => ({
      ...prevState,
      showEditions: !prevState.showEditions,
    }));
  };

  render() {
    const {
      showReactions,
      showComments,
      showEditions,
      showPositionEditor,
    } = this.state;
    const {
      hovered,
      isPersonal = true,
      onClickEdit,
      onClickRemove,
      question,
    } = this.props;

    const { numOfComments } = question.answer;
    const commentBtnText =
      numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;
    const answerId = question.answer.id;
    const hasEditions =
      question.answer.editions && question.answer.editions.length;

    return showPositionEditor ? (
      <PositionEditor
        position={question.answer.position}
        onClickMove={this.onMovePosition}
        onClickClose={this.togglePositionEditor}
      />
    ) : (
      <Fragment>
        <Row>
          <QuestionText> {question.question}</QuestionText>
          {isPersonal && (
            <QuestionOptions
              hideIcon={!hovered}
              onClickEdit={onClickEdit}
              onClickRemove={onClickRemove}
              onClickMove={this.togglePositionEditor}
            />
          )}
        </Row>
        <Answer viewMode question={question} />
        <Row>
          {hasEditions && (
            <Span onClick={this.toggleEditions}>edit history</Span>
          )}
          <Span onClick={this.toggleReactions}>15 Reactions</Span>
          <Span onClick={this.toggleComments}>{commentBtnText}</Span>
        </Row>
        {showComments && (
          <Comments answerId={answerId} onClose={this.toggleComments} />
        )}
        {showReactions && <Reactions onClose={this.toggleReactions} />}
        {showEditions && (
          <Editions
            editions={question.answer.editions}
            onClose={this.toggleEditions}
          />
        )}
      </Fragment>
    );
  }
}

export default QuestionViewer;
