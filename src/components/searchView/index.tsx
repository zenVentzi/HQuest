import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import { GET_USERS } from "GqlClient/user/queries";
import User from "Reusable/UserRow";
import StyledView from "../reusable/StyledView";
import { History, Location } from "history";
import { UsersQuery, UsersVariables } from "GqlClient/autoGenTypes";

const Row = styled.div`
  width: 60%;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

interface SearchViewProps {
  location: Location<{ username: string }>;
}

const SearchView = ({
  location: {
    state: { username }
  }
}: SearchViewProps) => {
  return (
    <StyledView>
      fdfd
      <Query<UsersQuery, UsersVariables>
        query={GET_USERS}
        variables={{ match: username }}
      >
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
