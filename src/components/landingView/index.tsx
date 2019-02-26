import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import StyledViewRaw from "../reusable/StyledView";
import LoginBtn from "./LoginBtn";

const StyledView = styled(StyledViewRaw)`
  align-items: center;
  text-align: left;
`;

const Row = styled.div`
  margin-bottom: 1em;
`;

const Intro = styled.div`
  margin-top: 1em;
  margin-bottom: 2em;
`;

interface Props extends RouteComponentProps {}

class LandingView extends Component<Props> {
  onLoggedIn = () => {
    const { history } = this.props;
    history.push("/help");
  };

  render() {
    return (
      <StyledView>
        <h1>Welcome to HQuest,</h1>
        <Intro>
          a minimalistic social network focused on answering, uncomfortable for
          some, questions publicly. ComfortZone-GetOut, Honesty-Unapologetic,
          Vulnerability-BigTime, Think-ALittleHarder-SlighlyDeeper.
          <br />
          <br /> Main features:
          <br /> - Search for users by name
          <br /> - Newsfeed with activity from the people you follow
          <br />- Keep track of the evolution ofyour answers throughout time.
          Every edit is saved in your edit history for that question
          <br /> - Give and receive feedback from others by liking and
          commenting on answers
          <br />
        </Intro>
        <div>
          <Row>Log in with: </Row>
          <Row>
            <LoginBtn onLoggedIn={this.onLoggedIn} />
          </Row>
          <Row>
            <LoginBtn
              testUser={{ name: "Test John", email: "testjohn@gmail.com" }}
              onLoggedIn={this.onLoggedIn}
            />
          </Row>
          <Row>
            <LoginBtn
              testUser={{ name: "Test Sarah", email: "testsarah@gmail.com" }}
              onLoggedIn={this.onLoggedIn}
            />
          </Row>
        </div>
      </StyledView>
    );
  }
}

export default withRouter(LandingView);
