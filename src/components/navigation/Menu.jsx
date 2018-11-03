import React from 'react';
import { withRouter } from 'react-router-dom';
import { getLoggedUserId } from 'Utils';
import TextLink from 'Reusable/TextLink';
import Dropdown from 'Reusable/Dropdown';
import { Menu as MenuIcon } from 'styled-icons/material/Menu';
import { AUTH_TOKEN, USER_ID } from 'Constants';

const Menu = ({ history }) => {
  const onLogOut = () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(USER_ID);
  };

  const id = getLoggedUserId();
  const editLink = `/userprofile/${id}/edit`;

  const items = [
    <TextLink key="edit" to={editLink}>
      Edit
    </TextLink>,
    <TextLink key="admin" to="/admin">
      Admin
    </TextLink>,
    <TextLink key="logout" onClick={onLogOut} to="/">
      Log out
    </TextLink>,
  ];

  return <Dropdown pivot="right" iconForBtn={MenuIcon} items={items} />;
};

export default withRouter(Menu);
