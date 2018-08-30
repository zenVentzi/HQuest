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
  width: 80%;
  padding: 0.2em 1em;
  border-radius: 0.2em;
  word-wrap: break-word;
`;

const Text = props => {
  const { viewMode, answer, onChange } = props;

  return viewMode ? (
    <Viewer>{answer}</Viewer>
  ) : (
    <TextArea defaultValue={answer} onChange={e => onChange(e.target.value)} />
  );
};

export default Text;
