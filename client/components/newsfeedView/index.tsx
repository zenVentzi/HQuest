import React from "react";
import styled from "styled-components";
import { Query, ApolloConsumer } from "react-apollo";
import distanceInWords from "date-fns/distance_in_words";
import shortid from "shortid";
import { GET_NEWSFEED } from "GqlClient/newsfeed/queries";
import StyledViewRaw from "../reusable/StyledView";
import News from "./News";
import {
  NewsfeedQuery,
  NewsfeedQueryVariables,
  UsersQueryVariables,
  UsersQuery
} from "GqlClient/autoGenTypes";
import { NetworkStatus } from "apollo-client";
import Navbar from "../navigation/index";
import Search from "../navigation/Search";
import { GET_USERS } from "GqlClient/user/queries";

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

export const getTime = (createdOn: string) => {
  const startDate = new Date(createdOn).getTime();
  const dateTimeNow = new Date().getTime();

  const res = distanceInWords(startDate, dateTimeNow, {
    includeSeconds: true
  });

  return `${res} ago`;
};

const NewsfeedView = () => {
  return (
    <>
      {/* comments below are for testing purposes */}
      {/* <Navbar /> */}
      {/* <Search /> */}
      {/* <ApolloConsumer>
        {client => (
          <button
            onClick={async () => {
              const res = await client.query<UsersQuery, UsersQueryVariables>({
                query: GET_USERS,
                variables: { match: "t" }
              });
            }}
          >
            button
          </button>
        )}
      </ApolloConsumer> */}
      <StyledView>
        <div style={{ fontSize: "16px", marginBottom: "10px" }}>Newsfeed</div>
        <Query<NewsfeedQuery, NewsfeedQueryVariables>
          query={GET_NEWSFEED}
          // variables={vars}
          fetchPolicy="cache-and-network"
          errorPolicy="all"
        >
          {({ loading, error, data, networkStatus }) => {
            // console.log(NetworkStatus[networkStatus]);

            if (loading) return <div> Loading newsfeed.. </div>;
            if (error) {
              return (
                <pre>
                  {error.graphQLErrors.map(({ message }, i) => (
                    <span key={`${shortid.generate()}`}>{message}</span>
                  ))}
                </pre>
              );
            }
            const { newsfeed } = data!;

            if (!newsfeed || !newsfeed.length) {
              return <div>No activity from your following.</div>;
            }

            return newsfeed.map(news => (
              <News key={shortid.generate()} news={news} />
            ));
          }}
        </Query>
      </StyledView>
    </>
  );
};

export default NewsfeedView;
