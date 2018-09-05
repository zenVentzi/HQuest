import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Transition } from 'react-spring';
import styled, { ThemeProvider, withTheme } from 'styled-components';

const St = styled(Link)`
  color: black;
  background: ${props => props.theme.backgroundColor};
`;

const theme = { backgroundColor: 'red' };

class App extends Component {
  state = { showAnswered: true };

  toggleAnswered = () => {
    this.setState({ showAnswered: !this.state.showAnswered });
  };
  render() {
    const { showAnswered } = this.state;

    return (
      <div>
        <Transition
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {showAnswered
            ? styles => <div style={styles}>answerd</div>
            : styles => <div style={styles}>unanswered</div>}
        </Transition>
        <button onClick={this.toggleAnswered}>toggle</button>
      </div>
    );
  }
}

export default App;
