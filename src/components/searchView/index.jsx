import React, { Fragment } from 'react';
import { parse } from 'qs';
import { Query } from 'react-apollo';
import { GET_USERS } from 'Queries';
import User from 'Reusable/UserRow';
import StyledView from '../reusable/StyledView';

const SearchView = ({
  location: {
    state: { username },
  },
}) => {
  return (
    <StyledView>
      <Query query={GET_USERS} variables={{ match: username }}>
        {({ loading, error, data: { users } }) => {
          if (loading) return <div> Loading..</div>;
          if (error) return <div> {error.message} </div>;
          if (!users.length) {
            return <div> No matches found </div>;
          }

          return (
            <Fragment>
              {users.map(user => (
                <User key={user.id} user={user} />
              ))}
            </Fragment>
          );
        }}
      </Query>
    </StyledView>
  );
};

export default SearchView;
