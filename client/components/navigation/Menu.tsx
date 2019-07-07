import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getLoggedUserId, deleteLoggedUserData, getLoggedUser } from "Utils";
import TextLink from "Reusable/TextLink";
import Dropdown from "Reusable/Dropdown";
import IconBtn from "Reusable/IconBtn";
import { Menu as MenuIcon } from "styled-icons/material/Menu";
import { UserRoles } from "GqlClient/autoGenTypes";

interface MenuProps extends RouteComponentProps {}

const Menu = ({ history }: MenuProps) => {
  const onLogOut = () => {
    deleteLoggedUserData();
  };

  // const id = getLoggedUserId();
  const loggedUser = getLoggedUser()!;
  const editLink = `/userprofile/${loggedUser.id}/edit`;

  const items = [
    <TextLink key="home" to={`/`}>
      Home
    </TextLink>
  ];

  items.push(
    <TextLink key="edit" to={editLink}>
      Edit
    </TextLink>
  );

  if (loggedUser.role === UserRoles.Admin) {
    items.push(
      <TextLink key="admin" to="/admin">
        Admin
      </TextLink>
    );
  }

  items.push(
    <TextLink key="logout" onClick={onLogOut} to="/">
      Log out
    </TextLink>
  );

  items.push(
    <TextLink key="faq" /* onClick={onLogOut} */ to="/faq">
      FAQ
    </TextLink>
  );

  return (
    <Dropdown
      pivot="right"
      dropBtn={
        <IconBtn
          icon={MenuIcon}
          size="2em"
          onClick={() => {}}
          color="white"
          backgroundColor="black"
        />
      }
      items={items}
    />
  );
};

export default withRouter(Menu);
