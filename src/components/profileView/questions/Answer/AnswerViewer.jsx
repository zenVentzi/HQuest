import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';

const Viewer = styled.div`
  background: black;
  color: white;
  width: 60%;
  line-height: 1.2;
  padding: 0.2em 1em;
  border-radius: 0.2em;
  word-wrap: break-word;
  /* text-align: center; */

  @media (max-width: 600px) {
    width: 90%;
  }
`;

// could be made stateless
class AnswerViewer extends Component {
  render() {
    const { answer } = this.props;

    const answerWithParagraphs = answer.value.split('\n').map(paragraph => (
      <span key={shortid.generate()}>
        {paragraph}
        <br />
      </span>
    ));

    return <Viewer>- {answerWithParagraphs}</Viewer>;
  }
}

export default AnswerViewer;
