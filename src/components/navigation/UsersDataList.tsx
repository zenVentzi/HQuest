import React from "react";

interface UsersDataListProps {
  users: any[];
}

const UsersDataList = React.forwardRef<HTMLDataListElement, UsersDataListProps>(
  ({ users }, ref) => {
    const options = users.map(user => (
      <option key={user.id}>{`${user.fullName}`}</option>
    ));

    // console.log(ref);

    return (
      <datalist id="users" ref={ref}>
        {options}
      </datalist>
    );
  }
);

export default UsersDataList;
