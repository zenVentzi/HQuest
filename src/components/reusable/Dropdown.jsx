import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
/* 
  display: flex;
 */
const StyledDropdown = styled.div`
  background: white;
  color: black;
  top: 2.3em;
  z-index: 1;
  right: 0;
  position: absolute;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
`;

const Option = styled.button`
  flex: 30px 0 0;
`;

/* 

  static defaultProps = {
    items: [
      { name: 'Edit', onClick: () => {} },
      { name: 'Log out', onClick: () => {} },
    ],
  }; */

class CommentOptions extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
      })
    ).isRequired,
  };

  handleClickOutside = e => {
    this.props.onClickOutside(e);
  };

  render() {
    const { items } = this.props;
    return (
      <StyledDropdown>
        {items.map(i => (
          <Option key={i.name} onClick={i.onClick}>
            {i.name}
          </Option>
        ))}
      </StyledDropdown>
    );
  }
}

export default onClickOutside(CommentOptions);
