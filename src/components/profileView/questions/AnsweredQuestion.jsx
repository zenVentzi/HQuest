import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getLoggedUserId } from 'Utils';
import Anchor from 'Reusable/Anchor';
import LikeBtn from './Answer/LikeBtn';
import Question from './Question';
import Comments from './Answer/Comments';
import Likes from './Answer/Likes';
import Editions from './Answer/Editions';
import OptionsDropdown from './Answer/Options';
import AnswerEditor from './Answer/AnswerEditor';
import AnswerViewer from './Answer/AnswerViewer';
import PositionEditor from './Answer/PositionEditor';
import AnsweredQuestionGql from './AnsweredQuestionGql';

const StyledQuestion = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid white;
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

const SmallBtn = styled(Anchor)`
  margin-right: 0.6em;
`;

class AnsweredQuestion extends Component {
  constructor(props) {
    super(props);

    const { answer } = this.props.question;
    let totalLikes = 0;
    let userLikes = 0;

    if (answer.likes) {
      totalLikes = answer.likes.total;
      const currentUserLikesObj = answer.likes.likers.find(
        liker => liker.user.id === getLoggedUserId()
      );

      if (currentUserLikesObj) {
        userLikes = currentUserLikesObj.numOfLikes;
      }
    }

    const numOfComments = answer.comments ? answer.comments.length : 0;
    const numOfEditions = answer.editions ? answer.editions.length : 0;

    this.state = {
      hovered: false,
      showComments: this.props.showComments,
      showLikes: false,
      showEditions: false,
      showAnswerEditor: false,
      showPositionEditor: false,
      totalLikes,
      userLikes,
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

  onRemove = ({ mutation }) => async () => {
    const answerId = this.props.question.answer.id;
    const variables = { answerId };
    await mutation({ variables });
    toast.success('🦄 Answer removed!');
    await this.props.onRemove();
  };

  onEditComment = async data => {
    await this.props.onEditComment(data);
  };

  onRemoveComment = async ({ commentId }) => {
    await this.props.onRemoveComment({ commentId });
    const numOfComments = this.state.numOfComments + 1;
    this.setState({ ...this.state, numOfComments });
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

  onSaveAnswer = ({ mutation }) => async ({ answerValue }) => {
    const isTheSame = this.props.question.answer.value === answerValue;

    if (isTheSame) {
      this.closeAnswerEditor();
      return;
      // print "Nothing changed"
    }

    const answerId = this.props.question.answer.id;
    const variables = { answerId, answerValue };
    await mutation({ variables });
    toast.success('🦄 Answer edited!');
    const numOfEditions = this.state.numOfEditions + 1;
    this.setState({ ...this.state, numOfEditions });
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

  onMovePosition = ({ mutation }) => async ({ newPosition }) => {
    const answerId = this.props.question.answer.id;
    const variables = { answerId, position: newPosition };
    await mutation({ variables });
    // await this.props.onClickMove({ newPosition });
    toast.success('🦄 Question moved!');
    this.closePositionEditor();
  };

  onAddComment = async ({ commentValue }) => {
    await this.props.onAddComment({ commentValue });
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

  onClickLike = ({ mutation }) => async () => {
    const userLikes = this.state.userLikes + 1;
    const totalLikes = this.state.totalLikes + 1;

    if (userLikes > 20) {
      toast.error('20 likes is the limit');
      return;
    }

    this.setState({ ...this.state, userLikes, totalLikes });

    this.cancelPrevWait();
    await this.wait({ milliseconds: 500 });
    /* because the user can click multiple times in a row */
    const answerId = this.props.question.answer.id;
    const variables = { answerId, userLikes };
    await mutation({ variables });
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
      scrollToComment,
      totalQuestionsCount,
      isPersonal,
      style,
    } = this.props;

    // console.log(this.state);

    const { comments } = question.answer;

    const likeBtnText = totalLikes === 1 ? '1 Like' : `${totalLikes} Likes`;
    const commentBtnText =
      numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;
    const editionsBtnText =
      numOfEditions === 1 ? `1 Edition` : `${numOfEditions} Editions`;

    return (
      <AnsweredQuestionGql>
        {(editAnswer, removeAnswer, moveAnswerPosition, likeAnswer) => {
          return (
            <StyledQuestion
              onMouseEnter={this.onMouseEnter}
              onFocus={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              // onBlur={this.onMouseLeave}
              style={style}
            >
              <Row>
                <Question question={question.value} />
                <OptionsDropdown
                  visible={isPersonal && hovered}
                  onClickEdit={this.openAnswerEditor}
                  onClickRemove={this.onRemove({ mutation: removeAnswer })}
                  onClickMove={this.openPositionEditor}
                />
              </Row>
              {showAnswerEditor ? (
                <AnswerEditor
                  questionType={question.type}
                  answer={question.answer}
                  possibleAnswers={question.possibleAnswers}
                  onClickSave={this.onSaveAnswer({ mutation: editAnswer })}
                />
              ) : (
                <AnswerViewer
                  questionType={question.type}
                  answer={question.answer}
                  possibleAnswers={question.possibleAnswers}
                />
              )}
              {showPositionEditor && (
                <PositionEditor
                  position={question.answer.position}
                  maxPosition={totalQuestionsCount}
                  onClickMove={this.onMovePosition({
                    mutation: moveAnswerPosition,
                  })}
                  onClickClose={this.closePositionEditor}
                />
              )}
              <Row hide={!hovered}>
                <LikeBtn
                  onClick={this.onClickLike({ mutation: likeAnswer })}
                  isLiked={question.answer.isLiked}
                />
                <SmallBtn onClick={this.toggleLikes}>{likeBtnText}</SmallBtn>
                <SmallBtn onClick={this.toggleComments}>
                  {commentBtnText}
                </SmallBtn>
                {!!numOfEditions && (
                  <SmallBtn onClick={this.toggleEditions}>
                    {editionsBtnText}
                  </SmallBtn>
                )}
              </Row>
              {showLikes && (
                <Likes
                  onClose={this.toggleLikes}
                  likes={question.answer.likes}
                />
              )}
              {showEditions && (
                <Editions
                  editions={question.answer.editions}
                  onClose={this.toggleEditions}
                />
              )}
              {(showComments || scrollToComment) && (
                <Comments
                  comments={comments}
                  scrollToComment={scrollToComment}
                  onAddComment={this.onAddComment}
                  onEditComment={this.onEditComment}
                  onRemoveComment={this.onRemoveComment}
                />
              )}
            </StyledQuestion>
          );
        }}
      </AnsweredQuestionGql>
    );
  }
}

export default AnsweredQuestion;
