import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';

const StyledDropdown = styled.div`
  display: flex;
  background: white;
  border-radius: 0.2em;
  color: black;
  top: ${props => props.marginTop};
  ${props => `${props.pivot}: 0;`} z-index: 1;
  position: absolute;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  align-items: stretch;

  & * {
    white-space: nowrap;
  }
`;

class DropdownList extends Component {
  static propTypes = {
    pivot: PropTypes.oneOf(['left', 'right']),
  };

  handleClickOutside = e => {
    this.props.onClickOutside(e);
  };

  render() {
    const { items, pivot, marginTop = '2.3em' } = this.props;
    return (
      <StyledDropdown marginTop={marginTop} pivot={pivot}>
        <Fragment>{items}</Fragment>
      </StyledDropdown>
    );
  }
}

export default onClickOutside(DropdownList);
