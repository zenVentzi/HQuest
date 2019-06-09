import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import Avatar from "../reusable/Avatar";
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
  word-wrap: break-word;
  text-align: left;
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
  border-radius: 0.2em;
  /* border: 1px solid white; */
  background-color: white;
  color: black;
  /* background: ${props => props.theme.backgroundColor}; */

  &:hover {
    cursor: pointer;
  }
`;

interface UserRowProps {
  size?: number;
  inversedColors?: boolean;
  user: UserFieldsFragment;
}

const UserRow = ({ size = 2, inversedColors, user }: UserRowProps) => {
  const [redirect, setRedirect] = useState(false);
  const [theme, setTheme] = useState({
    avatarSize: `${1.5 * size}em`,
    backgroundColor: inversedColors ? "white" : "black",
    foregroundColor: inversedColors ? "black" : "white"
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

  if (redirect) {
    const redirectTo = `/userProfile/${user.id}`;

    if (redirectTo === window.location.pathname) {
      // window.scroll(0, 0); doesn't work bcuz can't change state here
      window.location.reload();
      // think how you can reload the user component easily without passing down all the props down
      /* problem currently is that when we pass the same variables to the Query comp, it doesn't refetch. And
        in getUserQuery case the userId can be the same in case of refresh. One hacky way is to do refetch = refetch in render.
        then in componentDidUpdate to do a refetch */
    } else {
      return <Redirect push to={redirectTo} />;
    }
  }

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
        onClick={() => {
          setRedirect(true);
        }}
      >
        <Avatar
          src={user.avatarSrc}
          size={`${1.5 * size}em`}
          borderColor="black"
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

export default UserRow;
