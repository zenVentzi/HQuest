import React, { Component } from 'react';
import styled from 'styled-components';

const Text = styled.div`
  width: 100%;
  font-weight: bold;
  text-align: center;
  word-wrap: break-word;
  line-height: 1em;
  border-radius: 0.2em;
  padding-left: 1em;
  margin-bottom: 0.5em;
`;

class Question extends Component {
  render() {
    const { question } = this.props;
    return <Text> {question} </Text>;
  }
}

export default Question;
