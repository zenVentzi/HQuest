import React from 'react';
import styled from 'styled-components';

const TextArea = styled.textarea`
  display: block;
  margin: 1em auto;
  text-align: center;
  /* margin-left: auto; */
  margin-bottom: 1em;
  overflow: hidden;
  width: 80%;
`;

const Viewer = styled.div`
  background: black;
  color: white;
  width: 100%;
  padding: 0.2em 1em;
  border-radius: 0.2em;
  word-wrap: break-word;
  text-align: center;
`;

const MAX_LENGTH = 80;

const Text = props => {
  const { viewMode, answer, onChange } = props;

  return viewMode ? (
    <Viewer>{answer}</Viewer>
  ) : (
    <TextArea
      placeholder="Answer..."
      defaultValue={answer}
      maxLength={MAX_LENGTH}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default Text;
