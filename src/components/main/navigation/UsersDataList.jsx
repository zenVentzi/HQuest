import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_USERS = gql`
  query GetUsers($match: String) {
    users(match: $match) {
      id,
      name,
    }
  }`;

const UsersDataList = ({ match }) => {
  const renderOptions = (users) => {
    const options = users.map(user => (
      <option key={user.id} >
        {user.name}
      </option>
    ));

    return options;
  };

  return (
    <Query
      query={GET_USERS}
      variables={{ match }}
    >
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        console.log(data)        

        return (
          <datalist id="users">
            {renderOptions(data.users)}
          </datalist>
        );
      }}
    </Query>
    // <datalist id="users">
    //   <option>
    //     Pesho
    //   </option>
    // </datalist>
  );
};

export default UsersDataList;
