import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import { GET_USERS, GET_RANKINGS } from "GqlClient/user/queries";
// import User from "./UserRow";
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

interface FaqView {
  // location: Location;
  // location: Location<{ username: string }>;
}

const FaqView = ({  }: FaqView) => {
  return (
    <StyledView>
      FAQ{" "}
      <ul>
        <li>Resolution doesn't fit. Why?</li>
      </ul>
    </StyledView>
  );
};

export default FaqView;
