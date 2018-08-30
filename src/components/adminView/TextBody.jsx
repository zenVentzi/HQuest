import React, { Fragment } from 'react';
import styled from 'styled-components';

const TextArea = styled.textarea`
  margin-bottom: 1em;
  overflow: hidden;
  width: 95%;
`;

const TextBody = ({ onChange }) => {
  return (
    <Fragment>
      <TextArea
        placeholder="Enter the question here.."
        onChange={e => {
          const question = e.target.value;
          onChange({ question });
        }}
      />
    </Fragment>
  );
};

export default TextBody;
