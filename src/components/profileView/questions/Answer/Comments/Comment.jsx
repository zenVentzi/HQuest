import React, { Component } from 'react';
import styled from 'styled-components';
import { CaretSquareDown } from 'styled-icons/fa-regular/CaretSquareDown';
import User from 'Reusable/UserRow';
import CommentOptions from './CommentOptions';

const OptionsBtn = styled(CaretSquareDown).attrs({ size: '0.8em' })`
  cursor: pointer;
  margin-left: auto;
  align-self: center;
`;

const getAvatarWidth = size => `${2.5 * size}em`;

const Body = styled.p`
  /* width: 80%; */
  word-break: break-all;
  white-space: normal;
  font-family: 'Times New Roman', Times, serif;
  padding-left: ${props => getAvatarWidth(props.size)};
  font-size: 0.9em;
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
  state = { showOptionsDropdown: false, commentHovered: false };

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
    } = this.props;

    const { showOptionsDropdown, commentHovered } = this.state;
    const showOptionsBtn = commentHovered || showOptionsDropdown;

    return (
      <StyledComment
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Header>
          <User user={user} size={size} />
          {showOptionsBtn && (
            <OptionsBtn
              ref={elem => {
                this.optionsBtn = elem;
              }}
              onClick={this.toggleOptionsDropdown}
            />
          )}
          {showOptionsDropdown && (
            <CommentOptions onClickOutside={this.onClickOutsideOptions} />
          )}
        </Header>
        <Body size={size}>{comment}</Body>
      </StyledComment>
    );
  }
}

export default Comment;
