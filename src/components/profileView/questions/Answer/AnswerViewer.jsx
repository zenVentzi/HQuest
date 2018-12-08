import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Textarea from 'react-textarea-autosize';
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
`;

// could be made stateless
class AnswerViewer extends Component {
  render() {
    const { answer } = this.props;
    // return <Textarea defaultValue={answer.value} disabled />;

    // return <Viewer disabled value={answer.value} />;

    const answerWithParagraphs = answer.value.split('\n').map(paragraph => (
      <span key={shortid.generate()}>
        {paragraph}
        <br />
      </span>
    ));

    // const answerWithNewLines = Array.prototype.map.call(answer.value, )

    return <Viewer>{answerWithParagraphs}</Viewer>;
  }
}

export default AnswerViewer;
