import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import StyledViewRaw from "../reusable/StyledView";
import LoginBtn from "./LoginBtn";
import { getLoggedUser } from "Utils";
import StyledAnchor from "Reusable/Anchor";
import UndecoratedLink from "Reusable/UndecoratedLink";

const WhiteLink = styled(Link)`
  color: white;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
  }
`;

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
  font-size: 16px;
  /* text-align: center; */
`;

interface LandingViewProps extends RouteComponentProps {}

const LandingView = (props: LandingViewProps) => {
  const isUserLogged = !!getLoggedUser();
  const onLoggedIn = () => {
    const { history } = props;
    history.push("/help");
  };

  return (
    <StyledView>
      <h1>
        Welcome to HQuest,
        <sup
          style={{
            fontSize: "10px",
            verticalAlign: "top",
            position: "relative",
            top: "5px",
            right: "15px"
          }}
        >
          alpha
        </sup>
      </h1>
      <Intro>
        a minimalistic social network for all shades of non-pc, uncensored
        humor. Professional innovation one dick at a time. 18+. One button
        create/delete account. Please read the{" "}
        <WhiteLink
          to="/faq"
          // target="_blank"
        >
          FAQ
        </WhiteLink>
        <div style={{ marginTop: "20px" }}>
          Geek?{" "}
          <StyledAnchor
            href="https://github.com/zenVentzi/HQuest"
            target="_blank"
          >
            Source code
          </StyledAnchor>
        </div>
        {/* <br />
        <br /> Main features:
        <br /> - Search for users by name
        <br /> - Newsfeed with activity from the people you follow
        <br /> - Make many editions to your answers
        <br /> - Give and receive feedback from others by liking and commenting
        on editions
        <br /> */}
      </Intro>
      {!isUserLogged && (
        <div>
          <Row>Log in with: </Row>
          <Row>
            <LoginBtn onLoggedIn={onLoggedIn} />
          </Row>
          <Row>
            <LoginBtn
              testUser={{ name: "Test John", email: "testjohn@gmail.com" }}
              onLoggedIn={onLoggedIn}
            />
          </Row>
          <Row>
            <LoginBtn
              testUser={{ name: "Test Sarah", email: "testsarah@gmail.com" }}
              onLoggedIn={onLoggedIn}
            />
          </Row>
        </div>
      )}
    </StyledView>
  );
};

export default withRouter(LandingView);
