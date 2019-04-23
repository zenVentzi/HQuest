import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import distanceInWords from "date-fns/distance_in_words";
import shortid from "shortid";
import { GET_NEWSFEED } from "GqlClient/newsfeed/queries";
import StyledViewRaw from "../reusable/StyledView";
import News from "./News";
import { NewsfeedQuery, NewsfeedQueryVariables } from "GqlClient/autoGenTypes";

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

const NewsfeedView = () => (
  <StyledView>
    <div>Newsfeed!</div>
    <Query<NewsfeedQuery, NewsfeedQueryVariables>
      query={GET_NEWSFEED}
      // variables={vars}
      fetchPolicy="no-cache"
      errorPolicy="all"
    >
      {({ loading, error, data }) => {
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
);

export default NewsfeedView;
