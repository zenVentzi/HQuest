import React from 'react';

const UsersDataList = (props) => {
  const renderOptions = () => {
    if (props.usernames.length === 0) {
      return null;
    }

    // console.log(props.usernames)

    const options = props.usernames.map(name => (
      <option key={name} >
        {name}
      </option>
    ));
    return options;
  };

  return (
    <datalist id="users">
      {renderOptions()}
    </datalist>
  );
};

export default UsersDataList;
