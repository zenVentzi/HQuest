import styled from "styled-components";
import React from "react";
import Avatar from "Reusable/Avatar";
import { UserFieldsFragment } from "GqlClient/autoGenTypes";

const StyledUser = styled.div`
  color: black;
`;

type UsersDropdownItemProps = {
  user: UserFieldsFragment;
};

const UsersDropdownItem = (props: UsersDropdownItemProps) => {
  return (
    <StyledUser>
      <Avatar src={props.user.avatarSrc} />
      {props.user.fullName}
    </StyledUser>
  );
};

export default UsersDropdownItem;
