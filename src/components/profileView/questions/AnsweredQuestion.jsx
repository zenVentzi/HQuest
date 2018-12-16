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
    let currentUserLikes = 0;

    if (answer.likes) {
      totalLikes = answer.likes.total;
      const currentUserLikesObj = answer.likes.likers.find(
        liker => liker.user.id === getLoggedUserId()
      );

      if (currentUserLikesObj) {
        currentUserLikes = currentUserLikesObj.numOfLikes;
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

  onEditComment = () => {};

  onRemoveComment = async ({ commentId }) => {
    await this.props.onRemoveComment({ commentId });
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

    /* do I update the state here myself? or use derivedStateFromProps? I'll update it from here for now */

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

  onClickLike = () => {
    const currentUserLikes = this.state.currentUserLikes + 1;
    const totalLikes = this.state.totalLikes + 1;

    if (currentUserLikes > 20) {
      toast.error('20 likes is the limit');
      return;
    }
    // console.log(totalLikes);

    /* problem is that we wait to update the likes from the server to show the new number and then refetch and refresh the component.
    
    A solution is to show the current user likes in a separate window during clicking. It will show only the likes from state and not care about props. 1 second after click the cloud will disappear */

    this.setState({ ...this.state, currentUserLikes, totalLikes });

    // this.cancelPrevWait();
    // await this.wait({ milliseconds: 500 });
    // console.log(this.likeMutationTimeout);
    // await this.props.onClickLike({ numOfLikes: currentUserLikes });
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
          />
        )}
        {showPositionEditor && (
          <PositionEditor
            position={question.answer.position}
            maxPosition={totalQuestionsCount}
            onClickMove={this.onMovePosition}
            onClickClose={this.closePositionEditor}
          />
        )}
        {/* all the below can be moved to AnswerViewer */}
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
        {showLikes && (
          <Likes onClose={this.toggleLikes} likes={question.answer.likes} />
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
  }
}

export default AnsweredQuestion;
