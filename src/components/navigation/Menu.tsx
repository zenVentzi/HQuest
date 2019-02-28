import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getLoggedUserId } from "Utils";
import TextLink from "Reusable/TextLink";
import Dropdown from "Reusable/Dropdown";
import IconBtn from "Reusable/IconBtn";
import { Menu as MenuIcon } from "styled-icons/material/Menu";
import { AUTH_TOKEN, USER_ID } from "Constants";

interface MenuProps extends RouteComponentProps {}

const Menu = ({ history }: MenuProps) => {
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
    </TextLink>
  ];

  return (
    <Dropdown
      pivot="right"
      dropBtn={<IconBtn icon={MenuIcon} size="2em" onClick={() => {}} />}
      items={items}
    />
  );
};

export default withRouter(Menu);
