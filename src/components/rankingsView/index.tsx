import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import { GET_USERS, GET_RANKINGS } from "GqlClient/user/queries";
import User from "Reusable/UserRow";
import StyledView from "../reusable/StyledView";
import { History, Location } from "history";
import {
  UsersQuery,
  UsersQueryVariables,
  RankingsQuery,
  RankingsQueryVariables
} from "GqlClient/autoGenTypes";

const Row = styled.div`
  width: 60%;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

interface SearchViewProps {
  // location: Location;
  // location: Location<{ username: string }>;
}

const RankingsView = ({  }: SearchViewProps) => {
  return (
    <StyledView>
      <Query<RankingsQuery, RankingsQueryVariables>
        query={GET_RANKINGS}
        // variables={{ match: username }}
      >
        {({ loading, error, data }) => {
          if (loading) return <div> Loading..</div>;
          if (error) {
            console.log(error);
            console.log("maika ti qkichka");
            return <div> Problem occured. Work is being done to fix it </div>;
          }

          const { rankings } = data!;
          if (!rankings || !rankings.length) {
            return <div> No matches found </div>;
          }

          return (
            <Fragment>
              {rankings.map(user => (
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

export default RankingsView;
