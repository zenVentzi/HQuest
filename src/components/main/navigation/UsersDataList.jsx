import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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

function mapStateToProps(state) {
  const usernames = state.users.items.map(user => (user.name));

  return { usernames };
}

export default connect(mapStateToProps, null)(UsersDataList);
