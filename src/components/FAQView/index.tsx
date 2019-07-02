import React, { Fragment } from "react";
import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";
import { Query } from "react-apollo";
import styled from "styled-components";
import { GET_USERS, GET_RANKINGS } from "GqlClient/user/queries";
import StyledView from "../reusable/StyledView";

const Panel = Collapse.Panel;

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
      <div style={{ marginBottom: "10px" }}>FAQ</div>
      <Collapse accordion={true}>
        <Panel
          header="Resolution looks strange. Why?"
          headerClass="my-header-class"
        >
          Currently the app is developed and tested only on a (1920 x 1080)
          screen.
        </Panel>
        <Panel header="title2">this is panel content2 or other</Panel>
      </Collapse>
    </StyledView>
  );
};

export default FaqView;
