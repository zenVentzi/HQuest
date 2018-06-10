import React, { Fragment } from 'react';
import { parse } from 'qs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import StyledView from '../reusable/StyledView';
import User from './User';
import Navbar from '../navigation';

const GET_USERS = gql`
  query GetUsers($match: String) {
    users(match: $match) {
      id,
      firstName,
      surName,
    }
  }`;

function getMatchParam() {
  return parse(window.location.search.substr(1)).match;
}

const SearchView = () => {
  const renderUsers = (users) => {
    const userList = users.map((user) => {
      const test = 5;

      return (
        <User
          key={user.id}
          avatarSrc={user.avatarSrc}
          username={user.firstName}
        />
        // <div key={user.id} > {user.id} </div>
      );
    });

    return userList;
  };

  const renderNotFound = () => (<div> No matches found </div>);

  const renderSearch = (users) => {
    const hasMatchingUsers = users.length > 0;

    if (hasMatchingUsers) {
      return renderUsers(users);
    }

    return renderNotFound();
  };

  return (
    <Fragment>
      <Navbar />
      <StyledView>
        <Query
          query={GET_USERS}
          variables={{ match: getMatchParam() }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            return <Fragment> {renderSearch(data.users)} </Fragment>;
          }}
        </Query>
      </StyledView>
    </Fragment>
  );
};

export default SearchView;
