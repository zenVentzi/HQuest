import styled from "styled-components";
import React from "react";
import UsersDropdownItem from "./UsersDropdownItem";
import { UserFieldsFragment } from "GqlClient/autoGenTypes";
import Portal from "./Portal";

const StyledUsersDropdown = styled.div`
  position: absolute;
  background: white;
  width: 40%;
  margin-left: 6em;
`;

type UsersDropdownProps = {
  users: UserFieldsFragment[];
};

const UsersDropdown = (props: UsersDropdownProps) => {
  // return <div>dropdown</div>;
  return (
    <Portal>
      <StyledUsersDropdown>
        {props.users.map(user => (
          <UsersDropdownItem key={user.id} user={user} />
        ))}
      </StyledUsersDropdown>
    </Portal>
  );
};

export default UsersDropdown;
