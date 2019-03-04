import React from "react";
import { UsersUsers } from "GqlClient/autoGenTypes";

interface UsersDataListProps {
  users: UsersUsers[];
}

const UsersDataList = React.forwardRef<HTMLDataListElement, UsersDataListProps>(
  ({ users }, ref) => {
    const usersOptions = users.map(user => (
      <option key={user.id}>{`${user.fullName}`}</option>
    ));

    // console.log(ref);

    return (
      <datalist id="users" ref={ref}>
        {usersOptions}
      </datalist>
    );
  }
);

export default UsersDataList;
