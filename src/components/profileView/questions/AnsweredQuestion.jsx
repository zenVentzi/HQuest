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

  onClickEdit = async answerValue => {
    const { onClickEdit } = this.props;

    await onClickEdit(answerValue);
    this.toggleViewMode();
  };
  onClickRemove = async () => {
    const { onClickRemove } = this.props;
    await onClickRemove();
  };

  render() {
    const { hovered, viewMode } = this.state;
    const { question, isPersonal, collapseComments, style } = this.props;

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
            collapseComments={collapseComments}
            onClickEdit={this.onClickEdit}
            onClickRemove={this.onClickRemove}
          />
        ) : (
          // onSave, refetch
          <Fragment>
            <QuestionEditor question={question} onSaved={this.toggleViewMode} />
            <TextBtn onClick={this.onSave}>Save</TextBtn>
          </Fragment>
        )}
      </StyledQuestion>
    );
  }
}

export default AnsweredQuestion;
