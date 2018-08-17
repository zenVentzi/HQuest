import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Dropdown = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  border: 2px solid black;
  border-radius: 5px;
  position: fixed;
  margin-right: 200px;
  margin-top: 2px;
  background-color: white;
  width: 100px;
  /* left: 0; */
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const StyledBtn = styled.button`
  width: 95%;
  font-size: 15px;
  border: none;
  outline: none;
  font-family: 'Arial Black', Gadget, sans-serif;
  background-color: black;
  color: white;
  border-radius: 0.3em;
  /* padding: 0.2em 0.9em; */
  cursor: pointer;
  margin: 2px 2px 2px 2px;

  transition-duration: 0.2s;
  &:hover {
    background-color: gray;
  }
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
      return <Redirect push to={this.state.redirectRoute} />;
    }

    const { visible } = this.props;

    return (
      <Dropdown visible={visible}>
        <StyledBtn onClick={this.onClick(LOG_OUT)}>Log out</StyledBtn>
        <StyledBtn onClick={this.onClick(ADMIN)}>Admin</StyledBtn>
      </Dropdown>
    );
  }
}

export default MenuDropdown;
