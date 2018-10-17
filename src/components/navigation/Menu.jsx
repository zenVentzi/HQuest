import React from 'react';
import { withRouter } from 'react-router-dom';
import { getLoggedUserId } from 'Utils';
import TextBtn from 'Reusable/TextBtn';
import Dropdown from 'Reusable/Dropdown';
import { Menu as MenuIcon } from 'styled-icons/material/Menu';
import { AUTH_TOKEN, USER_ID } from 'Constants';

const Menu = ({ history }) => {
  const onLogOut = () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(USER_ID);
    history.push('/');
  };

  const id = getLoggedUserId();
  const editLink = `/userprofile/${id}/edit`;

  const items = [
    <TextBtn key="edit" link={editLink}>
      Edit
    </TextBtn>,
    <TextBtn key="admin" link="/admin">
      Admin
    </TextBtn>,
    <TextBtn key="logout" onClick={onLogOut}>
      Log out
    </TextBtn>,
  ];
  //  textForBtn="btn"
  return <Dropdown pivot="right" iconForBtn={MenuIcon} items={items} />;
};

export default withRouter(Menu);
