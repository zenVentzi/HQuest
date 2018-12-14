import React, { Component } from 'react';
import styled from 'styled-components';
import User from 'Reusable/UserRow';
import CommentOptions from './CommentOptions';

// const OptionsBtn = styled(CaretSquareDown).attrs({ size: '0.8em' })`
//   cursor: pointer;
//   margin-left: auto;
//   align-self: center;
// `;

// improve these hardcodings
const getAvatarWidth = size => `${2.6 * size}em`;

const Body = styled.p`
  /* width: 80%; */
  word-break: break-all;
  white-space: normal;
  padding-left: ${props => getAvatarWidth(props.size)};
  font-size: 0.9em;
  text-align: left;
`;

const StyledComment = styled.div`
  width: 80%;
  margin-bottom: 0.8em;
`;

const Header = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;
class Comment extends Component {
  static defaultProps = { size: 1.5 };
  state = { commentHovered: false };

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

  toggleOptionsDropdown = () => {
    this.setState(prevState => ({
      showOptionsDropdown: !prevState.showOptionsDropdown,
    }));
  };

  render() {
    const {
      comment: { user, comment },
      size,
      innerRef,
    } = this.props;

    const { commentHovered } = this.state;

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
            onClickRemove={this.onClickRemove}
          />
        </Header>
        <Body size={size}>{comment}</Body>
      </StyledComment>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Comment innerRef={ref} {...props} />
));
