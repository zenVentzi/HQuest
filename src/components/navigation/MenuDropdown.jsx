import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Dropdown from 'Reusable/Dropdown';
import { loggedUserId } from '../../utils';

const MenuDropdown = ({ history }) => {
  const logOut = () => {};
  const gotoAdminView = () => {
    history.push('/admin');
  };
  const gotoEditProfile = () => {
    const id = loggedUserId();
    history.push(`/userprofile/${id}/edit`);
  };

  const items = [
    {
      name: 'Edit',
      onClick: gotoEditProfile,
    },
    {
      name: 'Admin',
      onClick: gotoAdminView,
    },
    {
      name: 'Log out',
      onClick: logOut,
    },
  ];

  return <Dropdown items={items} />;
};

export default withRouter(MenuDropdown);
