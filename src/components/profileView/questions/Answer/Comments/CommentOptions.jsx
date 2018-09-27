import React, { Component } from 'react';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';

const StyledOptions = styled.div`
  background: white;
  color: black;
  /* height: 5em; */
  /* width: 4em; */
  top: 2em;
  z-index: 1;
  right: 0;
  padding: 0.1em;
  border-radius: 0.2em;
  /* align-items: stretch; */
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Option = styled.button`
  margin: 0.1em;
`;

class CommentOptions extends Component {
  handleClickOutside = e => {
    this.props.onClickOutside(e);
  };

  render() {
    return (
      <StyledOptions>
        <Option>Edit</Option>
        <Option>Remove</Option>
      </StyledOptions>
    );
  }
}

export default onClickOutside(CommentOptions);
