import React, { Fragment } from 'react';
import styled from 'styled-components';

const TextArea = styled.textarea`
  padding: 0.2em 0.9em;
  margin-bottom: 1em;
  resize: none;
  overflow: hidden;
  border: none;
  border-radius: 0.2em;
  background-color: black;
  color: white;
  width: 95%;
`;

const Value = styled.input`
  padding: 0.2em 0.9em;
  margin-bottom: 1em;
  border: none;
  border-radius: 0.2em;
  background-color: black;
  color: white;
  width: 10em;
`;

const ScaleBody = () => {
  const test = 5;

  const renderValues = () => {
    const values = [];

    for (let i = 0; i < 7; i++) {
      const placeholder = `${i}th value name`;
      values.push(
        <li key={i}>
          <Value placeholder={placeholder} />
        </li>
      );
    }

    return values;
  };

  return (
    <Fragment>
      <TextArea
        placeholder="Enter the question here.."
        onChange={() => {
          const test = 5;
        }}
      />
      <ol start="0">{renderValues()}</ol>
    </Fragment>
  );
};

export default ScaleBody;
