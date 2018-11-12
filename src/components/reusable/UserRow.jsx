import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { overrideTheme, inverseTheme } from 'Utils';
import { normalColors, inversedColors } from '../appTheme';
import Avatar from './Avatar';

const StyledUserName = styled.div`
  color: ${props => props.theme.foregroundColor};
  font-size: ${props => `${0.6 * props.size}em`};
  /* margin-bottom: 1em; */
`;

const StyledIntro = styled.div`
  font-size: ${props => `${0.4 * props.size}em`};
  font-style: oblique;
  color: ${props => props.theme.foregroundColor};
`;

const TextContainer = styled.div`
  display: flex;
  align-self: stretch;
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
  ${'' /* z-index: 1; */} border-radius: 0.2em;
  /* border: 1px solid white; */
  background: ${props => props.theme.backgroundColor};

  &:hover {
    cursor: pointer;
  }
`;

class UserRow extends Component {
  static defaultProps = { size: 2 };

  constructor(props) {
    super(props);

    const avatarSize = `${1.5 * props.size}em`;
    const themeColors = props.inversedColors ? inversedColors : normalColors;

    this.state = {
      redirect: false,
      theme: {
        avatarSize,
        ...themeColors,
      },
    };
  }

  onMouseEnter = () => {
    this.setState(prevState => ({
      ...prevState,
      theme: inverseTheme(prevState.theme),
    }));
  };

  onMouseLeave = () => {
    this.setState(prevState => ({
      ...prevState,
      theme: inverseTheme(prevState.theme),
    }));
  };

  render() {
    const {
      user: { id, fullName, intro, avatarSrc },
      size,
    } = this.props;

    if (this.state.redirect) {
      const redirectTo = `/userProfile/${id}`;
      return <Redirect push to={redirectTo} />;
    }

    const { theme } = this.state;

    return (
      <ThemeProvider theme={overrideTheme(theme)}>
        <StyledUser
          onMouseEnter={this.onMouseEnter}
          onFocus={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onBlur={this.onMouseLeave}
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
