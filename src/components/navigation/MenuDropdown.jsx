import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { loggedUserId } from '../../utils';

const Dropdown = styled.div`
  border-radius: 0.2em;
  background: white;
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

const LOG_OUT = 'LOG_OUT';
const ADMIN = 'ADMIN';
const EDIT = 'EDIT';

const MenuDropdown = ({ history }) => {
  const onClick = route => () => {
    switch (route) {
      case LOG_OUT:
        break;
      case ADMIN:
        history.push('/admin');
        break;
      case EDIT: {
        const id = loggedUserId();
        history.push(`/userprofile/${id}/edit`);
        break;
      }
      default:
        break;
    }
  };

  return (
    <Dropdown>
      <StyledBtn onClick={onClick(EDIT)}>Edit</StyledBtn>
      <StyledBtn onClick={onClick(ADMIN)}>Admin</StyledBtn>
      <StyledBtn onClick={onClick(LOG_OUT)}>Log out</StyledBtn>
    </Dropdown>
  );
};

export default withRouter(MenuDropdown);
