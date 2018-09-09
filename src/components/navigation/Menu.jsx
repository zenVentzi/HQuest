import React from 'react';
import { loggedUserId } from 'Utils';
import TextBtn from 'Reusable/TextBtn';
import Dropdown from 'Reusable/Dropdown';
import { Menu as MenuIcon } from 'styled-icons/material/Menu';

const Menu = () => {
  const onLogOut = () => {
    console.log('Menu.jsx onLogoUt');
  };

  const id = loggedUserId();
  const editLink = `/userprofile/${id}/edit`;

  const items = [
    <TextBtn key="edit" link={editLink}>
      Edit
    </TextBtn>,
    <TextBtn key="admin" link="/admin">
      Admin
    </TextBtn>,
    <TextBtn key="logout" onClick={onLogOut} link="/login">
      Log out
    </TextBtn>,
  ];

  return <Dropdown pivot="left" iconForBtn={MenuIcon} items={items} />;
};

export default Menu;
