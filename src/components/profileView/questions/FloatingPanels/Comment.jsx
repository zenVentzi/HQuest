import React, { Component } from 'react';
import styled from 'styled-components';
import { CaretSquareDown } from 'styled-icons/fa-regular/CaretSquareDown';
import User from './SubUser';
import CommentOptions from './CommentOptions';

const OptionsBtn = styled(CaretSquareDown).attrs({ size: '0.8em' })`
  cursor: pointer;
  margin-left: auto;
  align-self: center;
`;

const Text = styled.p`
  /* width: 80%; */
  font-family: 'Times New Roman', Times, serif;
  padding-left: 2.6em;
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
  state = { showOptions: false };

  onClickOutsideOptions = e => {
    const isOptionsBtn =
      e.target === this.optionsBtn || e.target === this.optionsBtn.children[0];
    if (isOptionsBtn) return;
    this.toggleOptions();
  };

  toggleOptions = () => {
    this.setState(prevState => ({ showOptions: !prevState.showOptions }));
  };

  render() {
    const {
      comment: { user, comment },
    } = this.props;

    return (
      <StyledComment>
        <Header>
          <User user={user} />
          <OptionsBtn
            innerRef={elem => {
              this.optionsBtn = elem;
            }}
            onClick={this.toggleOptions}
          />
          {this.state.showOptions && (
            <CommentOptions onClickOutside={this.onClickOutsideOptions} />
          )}
        </Header>
        <Text>{comment}</Text>
        {/* <Text>
          This is some very very long comment This is some very very long comment
          This is some very very long comment This is some very very long comment
          This is some very very long comment This is some very very long comment
          This is some very very long comment
        </Text> */}
      </StyledComment>
    );
  }
}

export default Comment;
