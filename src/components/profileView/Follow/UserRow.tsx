import React, { Component, useState } from "react";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import Avatar from "Reusable/Avatar";
import { UserFieldsFragment } from "GqlClient/autoGenTypes";

const Superscript = styled.span`
  background-color: #fa3e3e;
  border-radius: 2px;
  color: white;

  padding: 1px 3px;
  font-size: 10px;

  position: relative;
  vertical-align: super;
  user-select: none;
  top: 200;
  right: 0;
`;

interface StyledUserNameProps {
  size: number;
}

const StyledUserName = styled.div<StyledUserNameProps>`
  /* color: ${props => props.theme.foregroundColor}; */
  text-align: left;
  color: "black";
  font-size: ${props => `${1 * props.size}em`};
  /* margin-bottom: 1em; */

  @media (max-width: 600px) {
    font-size: ${props => `${0.8 * props.size}em`};
  }
  @media (max-width: 500px) {
    font-size: ${props => `${0.7 * props.size}em`};
  }
`;

interface StyledIntroProps {
  size: number;
}

const StyledIntro = styled.div<StyledIntroProps>`
  font-size: ${props => `${0.7 * props.size}em`};
  font-style: oblique;
  max-width: 100%;
  color: "black";
  word-wrap: break-word;
  /* color: ${props => props.theme.foregroundColor}; */

  @media (max-width: 600px) {
    font-size: ${props => `${0.6 * props.size}em`};
  }
  @media (max-width: 500px) {
    font-size: ${props => `${0.5 * props.size}em`};
  }
`;

interface StyledContainerProps {
  size: number;
}

const TextContainer = styled.div<StyledContainerProps>`
  display: flex;
  align-self: stretch;
  max-width: 80%;
  color: "black";
  padding: ${props => `${0.4 * props.size}em`};
  flex-direction: column;
  justify-content: space-between;
`;

const StyledUser = styled.div`
  display: flex;
  margin-bottom: 0.3em;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
  border-radius: 0.2em;
  /* border: 1px solid white; */
  background-color: white;
  /* color: "black"; */
  background: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.foregroundColor};

  &:hover {
    cursor: pointer;
  }
`;

interface UserRowProps extends RouteComponentProps {
  size?: number;
  user: UserFieldsFragment;
}

const UserRow = ({ size = 2, user, history }: UserRowProps) => {
  const [theme, setTheme] = useState({
    avatarSize: `${1.5 * size}em`,
    backgroundColor: "black",
    foregroundColor: "white"
  });
  // onMouseEnter = () => {
  //   setState(prevState => ({
  //     ...prevState,
  //     theme: inverseTheme(prevState.theme),
  //   }));
  // };

  // onMouseLeave = () => {
  //   setState(prevState => ({
  //     ...prevState,
  //     theme: inverseTheme(prevState.theme),
  //   }));
  // };

  return (
    <ThemeProvider
      theme={currentTheme => {
        return { ...currentTheme, ...theme };
      }}
    >
      <StyledUser
        // onMouseEnter={onMouseEnter}
        // onFocus={onMouseEnter}
        // onMouseLeave={onMouseLeave}
        // onBlur={onMouseLeave}
        onClick={e => {
          history.push(`/userProfile/${user.id}`);
        }}
      >
        <Avatar
          src={user.avatarSrc}
          size={`${1.5 * size}em`}
          borderColor={"white"}
        />
        <TextContainer size={size}>
          <StyledUserName size={size}>
            {user.fullName}
            <Superscript>{user.experience}exp</Superscript>
          </StyledUserName>
          <StyledIntro size={size}>{user.intro}</StyledIntro>
        </TextContainer>
      </StyledUser>
    </ThemeProvider>
  );
};

export default withRouter(UserRow);
