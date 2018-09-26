import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';
import QuestionViewer from './QuestionViewer';
import QuestionEditor from './QuestionEditor';

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
  /* height: 100px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class AnsweredQuestion extends Component {
  state = {
    hovered: false,
    viewMode: true,
  };

  answerValue = this.props.question.answer.value;

  onMouseEnter = () => {
    this.toggleHovered(true);
  };

  onMouseLeave = () => {
    this.toggleHovered(false);
  };

  toggleHovered = value => {
    this.setState({ ...this.state, hovered: value });
  };

  toggleViewMode = () => {
    this.setState({ ...this.state, viewMode: !this.state.viewMode });
  };

  onClickEdit = () => {
    this.toggleViewMode();
  };

  onClickSave = async () => {
    await this.props.onClickSave(this.answerValue);
    // todo: only toggle if successful
    this.toggleViewMode();
  };

  onClickRemove = async () => {
    await this.props.onClickRemove();
  };

  onMovePosition = async ({ newPosition }) => {
    await this.props.onMovePosition({ newPosition });
  };

  onChange = answerValue => {
    this.answerValue = answerValue;
  };

  render() {
    const { hovered, viewMode } = this.state;
    const {
      question,
      totalQuestionsCount,
      isPersonal,
      collapseComments,
      style,
    } = this.props;

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onFocus={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onBlur={this.onMouseLeave}
        style={style}
      >
        {viewMode ? (
          <QuestionViewer
            hovered={hovered}
            isPersonal={isPersonal}
            question={question}
            totalQuestionsCount={totalQuestionsCount}
            collapseComments={collapseComments}
            onClickEdit={this.onClickEdit}
            onClickRemove={this.onClickRemove}
            onMovePosition={this.onMovePosition}
          />
        ) : (
          // onSave, refetch
          <Fragment>
            <QuestionEditor question={question} onChange={this.onChange} />
            <TextBtn onClick={this.onClickSave}>Save</TextBtn>
          </Fragment>
        )}
      </StyledQuestion>
    );
  }
}

export default AnsweredQuestion;
