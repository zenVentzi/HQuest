import React, { Fragment } from "react";
import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";
import { Query } from "react-apollo";
import styled from "styled-components";
import { GET_USERS, GET_RANKINGS } from "GqlClient/user/queries";
import StyledView from "../reusable/StyledView";
import { Link } from "react-router-dom";
import StyledAnchor from "Reusable/Anchor";

const Panel = Collapse.Panel;

const Row = styled.div`
  width: 60%;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const WhiteLink = styled(StyledAnchor)`
  color: black;
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
        <Panel header="How do I get exp?">
          When other users like your comments and editions
        </Panel>
        <Panel header="What is edition?">
          When you answer a question, the answer is considered 1'st edition.
          Then you can edit your answer, where the new answer becomes the 2'nd
          edition. And so on.
        </Panel>
        <Panel header="How do I answer a question?">
          Go to your profile. Toggle the "answered/unanswered" button to
          "unanswered". Pick a question and answer it.
        </Panel>
        <Panel header="Why no newsfeed activity?">
          The users you follow haven't been active. Or you follow nobody.
        </Panel>
        <Panel header="Is Facebook login safe?">
          Safer than hillary clinton's emails. App has access only to most basic
          data such as username
        </Panel>
        <Panel header="What does alpha(next to HQuest) imply?">
          Alpha testing. Meaning that app data will probably be removed multiple
          times before the final release. And, of course, that the app is far
          from finished.
        </Panel>
        <Panel header="What does Move button(next to question) do?">
          Every time you add a new answer, it gets positioned on top of all your
          other answers. Use the "Move" button if you want to reposition older
          answers above newer ones.
        </Panel>
        <Panel header="How do I give feedback?">
          Since the database gets reset during alpha testing, there isn't a good
          way to store the feedback. Current, sucky, solution is{" "}
          <WhiteLink href="https://docs.google.com/spreadsheets/d/1cCuKrX07Ynj2lUC8YU7dApwXHz1hZ9mjhDak_xeTuQk/edit?usp=sharing">
            {" "}
            this spreadsheet
          </WhiteLink>
          . If you're dev, and you've found a bug, you can also create an issue{" "}
          <WhiteLink href="https://github.com/zenVentzi/HQuest">
            {" "}
            on Github
          </WhiteLink>
          .
        </Panel>
      </Collapse>
    </StyledView>
  );
};

export default FaqView;
