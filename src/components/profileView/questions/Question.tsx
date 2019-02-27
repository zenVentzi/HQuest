import React, { Component } from "react";
import styled from "styled-components";

const Text = styled.div`
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  word-wrap: break-word;
  line-height: 1em;
  border-radius: 0.2em;
  padding-left: 1em;
  margin-bottom: 0.5em;

  @media (max-width: 600px) {
    font-size: 1.2em;
  }
`;

interface QuestionProps {
  question: string;
}

class Question extends Component<QuestionProps> {
  render() {
    const { question } = this.props;
    return <Text> {question} </Text>;
  }
}

export default Question;
