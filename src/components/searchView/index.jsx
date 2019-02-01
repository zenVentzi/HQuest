import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { GET_USERS } from 'Queries';
import User from 'Reusable/UserRow';
import StyledView from '../reusable/StyledView';

const Row = styled.div`
  width: 60%;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const SearchView = ({
  location: {
    state: { username },
  },
}) => {
  return (
    <StyledView>
      fdfd
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
                <Row key={user.id}>
                  <User user={user} />
                </Row>
              ))}
            </Fragment>
          );
        }}
      </Query>
    </StyledView>
  );
};

export default SearchView;
