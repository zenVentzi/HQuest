import React, { Fragment } from 'react';
import { parse } from 'qs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import StyledView from '../reusable/StyledView';
import User from './User';
import Navbar from '../navigation';

const GET_USERS = gql`
  query users($match: String) {
    users(match: $match) {
      id
      fullName
    }
  }
`;

function getMatchParam() {
  return parse(window.location.search.substr(1)).match;
}

const SearchView = () => {
  const test = 5;

  return (
    <Fragment>
      <Navbar />
      <StyledView>
        <Query query={GET_USERS} variables={{ match: getMatchParam() }}>
          {({ loading, error, data: { users } }) => {
            if (loading) return <div> Loading..</div>;
            if (error) return <div> {error.message} </div>;
            if (!users.length) {
              return <div> No matches found </div>;
            }

            return (
              <Fragment>
                {users.map(user => <User key={user.id} user={user} />)}
              </Fragment>
            );
          }}
        </Query>
      </StyledView>
    </Fragment>
  );
};

export default SearchView;
