import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Dropdown = styled.div`
  border-radius: 0.2em;
  background: black;
  text-align: center;
  position: absolute;
  top: 2.2em;
  right: 0;
  width: 100px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const StyledBtn = styled.button`
  width: 100%;
`;

const LOG_OUT = `/logout`;
const ADMIN = `/admin`;

class MenuDropdown extends Component {
  state = {
    redirectRoute: null,
  };

  onClick = route => () => {
    this.setState({ redirectRoute: route });
  };

  render() {
    if (this.state.redirectRoute) {
      console.log(`bla`);
      return <Redirect push to={this.state.redirectRoute} />;
    }

    return (
      <Dropdown>
        <StyledBtn onClick={this.onClick(LOG_OUT)}>Log out</StyledBtn>
        <StyledBtn onClick={this.onClick(ADMIN)}>Admin</StyledBtn>
      </Dropdown>
    );
  }
}

export default MenuDropdown;
