import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Question from './Question';
import Comments from './Answer/Comments';
import Reactions from './Answer/Reactions';
import Editions from './Answer/Editions';
import AnswerOptions from './Answer/Options';
import AnswerEditor from './Answer/AnswerEditor';
import AnswerViewer from './Answer/AnswerViewer';
import PositionEditor from './Answer/PositionEditor';

const StyledQuestion = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid white;
  padding-bottom: 1em;
  margin-bottom: 2em;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  visibility: ${props => (props.hide ? 'hidden' : 'visible')};
  justify-content: center;
`;

const Span = styled.span`
  cursor: pointer;
  margin-right: 0.6em;
  font-size: 0.7em;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
  }
`;

class AnsweredQuestion extends Component {
  state = {
    hovered: false,
    showComments: !this.props.collapseComments,
    showReactions: false,
    showEditions: false,
    showAnswerEditor: false,
    showPositionEditor: false,
  };

  onMouseEnter = () => {
    this.toggleHovered(true);
  };

  onMouseLeave = () => {
    this.toggleHovered(false);
  };

  onClickRemove = async () => {
    await this.props.onClickRemove();
  };

  toggleHovered = value => {
    this.setState({ ...this.state, hovered: value });
  };

  openAnswerEditor = () => {
    this.setState({
      ...this.state,
      showAnswerEditor: true,
      showPositionEditor: false,
    });
  };

  closeAnswerEditor = () => {
    this.setState({
      ...this.state,
      showAnswerEditor: false,
    });
  };

  openPositionEditor = () => {
    this.setState({
      ...this.state,
      showPositionEditor: true,
      showAnswerEditor: false,
    });
  };

  closePositionEditor = () => {
    this.setState({
      ...this.state,
      showPositionEditor: false,
    });
  };

  onSaveAnswer = async ({ answerValue }) => {
    const isTheSame = this.props.question.answer.value === answerValue;

    if (isTheSame) {
      this.closeAnswerEditor();

      // print "Nothing changed"
      return;
    }

    await this.props.onClickSave({ answerValue });
    // todo: only toggle if successful
    this.closeAnswerEditor();
  };

  toggleComments = () => {
    this.setState(prevState => ({
      ...prevState,
      showComments: !prevState.showComments,
      showReactions: false,
      showEditions: false,
    }));
  };

  toggleReactions = () => {
    this.setState(prevState => ({
      ...prevState,
      showReactions: !prevState.showReactions,
      showComments: false,
      showEditions: false,
    }));
  };

  toggleEditions = () => {
    this.setState(prevState => ({
      ...prevState,
      showEditions: !prevState.showEditions,
      showComments: false,
      showReactions: false,
    }));
  };

  onMovePosition = async ({ newPosition }) => {
    await this.props.onClickMove({ newPosition });
    // check for success or failure
    this.closePositionEditor();
  };

  render() {
    const {
      hovered,
      showReactions,
      showComments,
      showEditions,
      showPositionEditor,
      showAnswerEditor,
    } = this.state;
    const {
      question,
      totalQuestionsCount,
      isPersonal,
      collapseComments,
      style,
    } = this.props;

    // console.log(showPositionEditor);

    const hasEditions =
      question.answer.editions && question.answer.editions.length;
    const { numOfComments } = question.answer;
    const commentBtnText =
      numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onFocus={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onBlur={this.onMouseLeave}
        style={style}
      >
        <Row>
          <Question question={question.question} />
          <AnswerOptions
            visible={isPersonal && hovered}
            onClickEdit={this.openAnswerEditor}
            onClickRemove={this.onClickRemove}
            onClickMove={this.openPositionEditor}
          />
        </Row>
        {showAnswerEditor ? (
          <AnswerEditor
            questionType={question.type}
            answer={question.answer}
            possibleAnswers={question.possibleAnswers}
            onClickSave={this.onSaveAnswer}
          />
        ) : (
          <AnswerViewer
            questionType={question.type}
            answer={question.answer}
            possibleAnswers={question.possibleAnswers}
            collapseComments={collapseComments}
          />
        )}
        {showPositionEditor && (
          <PositionEditor
            position={question.answer.position}
            maxPosition={totalQuestionsCount}
            onClickMove={this.onMovePosition}
            onClickClose={this.togglePositionEditor}
          />
        )}
        <Row hide={!hovered}>
          {hasEditions && (
            <Span onClick={this.toggleEditions}>edit history</Span>
          )}
          <Span onClick={this.toggleReactions}>15 Reactions</Span>
          <Span onClick={this.toggleComments}>{commentBtnText}</Span>
        </Row>
        {showReactions && <Reactions onClose={this.toggleReactions} />}
        {showEditions && (
          <Editions
            editions={question.answer.editions}
            onClose={this.toggleEditions}
          />
        )}
        {showComments && (
          <Comments
            answerId={question.answer.id}
            onClose={this.toggleComments}
          />
        )}
      </StyledQuestion>
    );
  }
}

export default AnsweredQuestion;
