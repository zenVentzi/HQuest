import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import { GET_USERS } from "GqlClient/user/queries";
import User from "Reusable/UserRow";
import StyledView from "../reusable/StyledView";
import { History, Location } from "history";
import { UsersQuery, UsersQueryVariables } from "GqlClient/autoGenTypes";

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
      <Query<UsersQuery, UsersQueryVariables>
        query={GET_USERS}
        variables={{ match: username }}
      >
        {({ loading, error, data }) => {
          if (loading) return <div> Loading..</div>;
          if (error) {
            console.log(error);
            console.log("maika ti qkichka");
            return <div> Problem occured. Work is being done to fix it </div>;
          }

          const { users } = data!;
          if (!users || !users.length) {
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
