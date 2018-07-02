import React from 'react';

const UsersDataList = ({ users }) => {
  const options = users.map(user => (
    <option key={user.id}>{`${user.fullName}`}</option>
  ));

  return <datalist id="users">{options}</datalist>;
};

export default UsersDataList;
