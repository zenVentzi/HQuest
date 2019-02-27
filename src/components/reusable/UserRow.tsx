import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { overrideTheme, inverseTheme } from "Utils";
import Avatar from "./Avatar";

interface StyledUserNameProps {
  size: number;
}

const StyledUserName = styled.div<StyledUserNameProps>`
  color: ${props => props.theme.foregroundColor};
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
  color: ${props => props.theme.foregroundColor};

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
  background: ${props => props.theme.backgroundColor};

  &:hover {
    cursor: pointer;
  }
`;

interface UserRowProps {
  size: number;
  inversedColors?: boolean;
  user: any;
}

class UserRow extends Component<UserRowProps> {
  static defaultProps = { size: 2 };
  state: any;

  constructor(props: UserRowProps) {
    super(props);

    const avatarSize = `${1.5 * props.size}em`;
    const normalColors = { backgroundColor: "black", foregroundColor: "white" };
    const inversedColors = inverseTheme(normalColors);
    const themeColors = props.inversedColors ? inversedColors : normalColors;

    this.state = {
      redirect: false,
      theme: {
        avatarSize,
        ...themeColors
      }
    };
  }

  // onMouseEnter = () => {
  //   this.setState(prevState => ({
  //     ...prevState,
  //     theme: inverseTheme(prevState.theme),
  //   }));
  // };

  // onMouseLeave = () => {
  //   this.setState(prevState => ({
  //     ...prevState,
  //     theme: inverseTheme(prevState.theme),
  //   }));
  // };

  render() {
    const {
      user: { id, fullName, intro, avatarSrc },
      size
    } = this.props;

    if (this.state.redirect) {
      const redirectTo = `/userProfile/${id}`;

      if (redirectTo === window.location.pathname) {
        // window.scroll(0, 0); doesn't work bcuz can't change state here
        window.location.reload();
        // think how you can reload the user component easily without passing down all the props down
        /* problem currently is that when we pass the same variables to the Query comp, it doesn't refetch. And
        in getUserQuery case the userId can be the same in case of refresh. One hacky way is to do this.refetch = refetch in render.
        then in componentDidUpdate to do a refetch */
      } else {
        return <Redirect push to={redirectTo} />;
      }
    }

    const { theme } = this.state;

    return (
      <ThemeProvider theme={overrideTheme(theme)}>
        <StyledUser
          // onMouseEnter={this.onMouseEnter}
          // onFocus={this.onMouseEnter}
          // onMouseLeave={this.onMouseLeave}
          // onBlur={this.onMouseLeave}
          onClick={() => {
            this.setState({ redirect: true });
          }}
        >
          <Avatar src={avatarSrc} />
          <TextContainer size={size}>
            <StyledUserName size={size}>{fullName}</StyledUserName>
            <StyledIntro size={size}>{intro}</StyledIntro>
          </TextContainer>
        </StyledUser>
      </ThemeProvider>
    );
  }
}

export default UserRow;
