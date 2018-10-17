import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import StyledViewRaw from '../reusable/StyledView';
import LoginBtn from './LoginBtn';

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

class LandingView extends Component {
  onLoggedIn = () => {
    const { history } = this.props;
    history.push('/help');
  };

  render() {
    return (
      <StyledView>
        <h1>Welcome to HQuest!</h1>
        <iframe
          title="title"
          width="420"
          height="345"
          src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1"
        />
        <div>
          <span>Log in with: </span>
          <LoginBtn onLoggedIn={this.onLoggedIn} />
        </div>
      </StyledView>
    );
  }
}

export default withRouter(LandingView);
