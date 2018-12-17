import React, { Component } from 'react';
import styled from 'styled-components';
import User from 'Reusable/UserRow';
import CommentOptions from './CommentOptions';
import CommentViewer from './CommentViewer';
import CommentEditor from './CommentEditor';

// const OptionsBtn = styled(CaretSquareDown).attrs({ size: '0.8em' })`
//   cursor: pointer;
//   margin-left: auto;
//   align-self: center;
// `;

const StyledComment = styled.div`
  width: 80%;
  margin-bottom: 0.8em;
`;

const Header = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-bottom: 0.5em;
`;
class Comment extends Component {
  static defaultProps = { size: 1.5 };
  state = { commentHovered: false, viewMode: true };

  onClickOutsideOptions = e => {
    const isOptionsBtn =
      e.target === this.optionsBtn || e.target === this.optionsBtn.children[0];
    if (isOptionsBtn) return;
    this.toggleOptionsDropdown();
  };

  onMouseEnter = () => {
    this.setState(prevState => ({ ...prevState, commentHovered: true }));
  };

  onMouseLeave = () => {
    this.setState(prevState => ({ ...prevState, commentHovered: false }));
  };

  onRemove = async () => {
    await this.props.onRemove({ commentId: this.props.comment.id });
  };

  onClickEdit = () => {
    this.setState({ ...this.state, viewMode: false });
  };

  onCancelEdit = () => {
    this.setState({ ...this.state, viewMode: true });
  };

  onEdit = async ({ newComment }) => {
    await this.props.onEdit({
      commentId: this.props.comment.id,
      commentValue: newComment,
    });
    this.setState({ ...this.state, viewMode: true });
  };

  toggleOptionsDropdown = () => {
    this.setState(prevState => ({
      showOptionsDropdown: !prevState.showOptionsDropdown,
    }));
  };

  render() {
    const {
      comment: { user, value },
      size,
      innerRef,
    } = this.props;

    const { commentHovered, viewMode } = this.state;

    return (
      <StyledComment
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={innerRef}
      >
        <Header>
          <User user={user} size={size} />
          <CommentOptions
            visible={user.me && commentHovered}
            onClickEdit={this.onClickEdit}
            onClickRemove={this.onRemove}
          />
        </Header>
        {viewMode ? (
          <CommentViewer comment={value} />
        ) : (
          <CommentEditor
            comment={value}
            onEdit={this.onEdit}
            onCancel={this.onCancelEdit}
          />
        )}
      </StyledComment>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Comment innerRef={ref} {...props} />
));
