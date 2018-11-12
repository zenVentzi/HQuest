import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getLoggedUserId } from 'Utils';
import LikeBtn from './Answer/LikeBtn';
import Question from './Question';
import Comments from './Answer/Comments';
import Likes from './Answer/Likes';
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

const SmallBtn = styled.span`
  cursor: pointer;
  user-select: none;
  margin-right: 0.6em;
  font-size: 0.7em;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
  }
`;

class AnsweredQuestion extends Component {
  constructor(props) {
    super(props);

    const { answer } = this.props.question;
    let totalLikes = 0;
    let currentUserLikes = 0;

    if (answer.likes) {
      totalLikes = answer.likes.total;
      const currentUserLikesObj = answer.likes.likers.find(
        liker => liker.id === getLoggedUserId()
      );

      if (currentUserLikesObj) {
        currentUserLikes = currentUserLikesObj.numOfLikes;
      }
    }

    const { numOfComments } = answer;
    const numOfEditions = answer.editions ? answer.editions.length : 0;

    this.state = {
      hovered: false,
      showComments: !this.props.collapseComments,
      showLikes: false,
      showEditions: false,
      showAnswerEditor: false,
      showPositionEditor: false,
      totalLikes,
      currentUserLikes,
      numOfComments,
      numOfEditions,
    };
  }

  onMouseEnter = () => {
    this.toggleHovered(true);
  };

  onMouseLeave = () => {
    // console.log(`mouseleave`);
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
      return;
      // print "Nothing changed"
    }

    const numOfEditions = this.state.numOfEditions + 1;
    this.setState({ ...this.state, numOfEditions });

    await this.props.onClickSave({ answerValue });
    // todo: only toggle if successful
    this.closeAnswerEditor();
  };

  toggleComments = () => {
    this.setState(prevState => ({
      ...prevState,
      showComments: !prevState.showComments,
      showLikes: false,
      showEditions: false,
    }));
  };

  toggleLikes = () => {
    this.setState(prevState => ({
      ...prevState,
      showLikes: !prevState.showLikes,
      showComments: false,
      showEditions: false,
    }));
  };

  toggleEditions = () => {
    this.setState(prevState => ({
      ...prevState,
      showEditions: !prevState.showEditions,
      showComments: false,
      showLikes: false,
    }));
  };

  onMovePosition = async ({ newPosition }) => {
    await this.props.onClickMove({ newPosition });
    // check for success or failure
    this.closePositionEditor();
  };

  onAddComment = () => {
    const numOfComments = this.state.numOfComments + 1;
    this.setState({ ...this.state, numOfComments });
  };

  wait = async ({ milliseconds }) => {
    return new Promise(resolve => {
      this.timeoutIndex = setTimeout(resolve, milliseconds);
    });
    // return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  cancelPrevWait = () => {
    if (this.timeoutIndex) {
      clearTimeout(this.timeoutIndex);
      this.timeoutIndex = null;
    }
  };

  onClickLike = async () => {
    const currentUserLikes = this.state.currentUserLikes + 1;
    const totalLikes = this.state.totalLikes + 1;

    if (currentUserLikes > 20) {
      toast.error('20 likes is the limit');
      return;
    }

    this.setState({ ...this.state, currentUserLikes, totalLikes });

    // this.cancelPrevWait();
    // await this.wait({ milliseconds: 500 });
    // console.log(this.likeMutationTimeout);
    await this.props.onClickLike({ numOfLikes: currentUserLikes });
  };

  render() {
    const {
      hovered,
      showLikes,
      showComments,
      showEditions,
      showPositionEditor,
      showAnswerEditor,
      totalLikes,
      numOfComments,
      numOfEditions,
    } = this.state;
    const {
      question,
      totalQuestionsCount,
      isPersonal,
      collapseComments,
      style,
    } = this.props;

    const likeBtnText = totalLikes === 1 ? '1 Like' : `${totalLikes} Likes`;
    const commentBtnText =
      numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;
    const editionsBtnText =
      numOfEditions === 1 ? `1 Edition` : `${numOfEditions} Editions`;

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onFocus={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        // onBlur={this.onMouseLeave}
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
          <LikeBtn
            onClick={this.onClickLike}
            isLiked={question.answer.isLiked}
          />
          <SmallBtn onClick={this.toggleLikes}>{likeBtnText}</SmallBtn>
          <SmallBtn onClick={this.toggleComments}>{commentBtnText}</SmallBtn>
          {!!numOfEditions && (
            <SmallBtn onClick={this.toggleEditions}>{editionsBtnText}</SmallBtn>
          )}
        </Row>
        {showLikes && <Likes onClose={this.toggleLikes} />}
        {showEditions && (
          <Editions
            editions={question.answer.editions}
            onClose={this.toggleEditions}
          />
        )}
        {showComments && (
          <Comments
            answerId={question.answer.id}
            onAdd={this.onAddComment}
            onClose={this.toggleComments}
          />
        )}
      </StyledQuestion>
    );
  }
}

export default AnsweredQuestion;
