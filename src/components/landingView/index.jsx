import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import StyledViewRaw from '../reusable/StyledView';
import LoginBtn from './LoginBtn';

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

const Row = styled.div`
  margin-bottom: 1em;
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
          src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=0"
        />
        <div>
          <Row>Log in with: </Row>
          <Row>
            <LoginBtn onLoggedIn={this.onLoggedIn} />
          </Row>
          <Row>
            <LoginBtn
              testUser={{ name: 'Test John', email: 'testjohn@gmail.com' }}
              onLoggedIn={this.onLoggedIn}
            />
          </Row>
          <Row>
            <LoginBtn
              testUser={{ name: 'Test Sarah', email: 'testsarah@gmail.com' }}
              onLoggedIn={this.onLoggedIn}
            />
          </Row>
        </div>
      </StyledView>
    );
  }
}

export default withRouter(LandingView);
