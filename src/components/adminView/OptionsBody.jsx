import React, { Fragment } from 'react';
import styled from 'styled-components';

const StyledBtn = styled.button`
  width: 10em;
  margin: 1em;
`;

const TextArea = styled.textarea`
  margin-bottom: 1em;
  overflow: hidden;
  width: 95%;
`;

const Value = styled.input`
  margin-bottom: 1em;
  width: 10em;
`;

const OptionsBody = () => {
  const test = 5;

  const renderOptions = () => {
    const values = [];

    for (let i = 0; i < 3; i++) {
      const placeholder = `option name..`;
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
      <ul>{renderOptions()}</ul>
      <div>
        <StyledBtn>Add option</StyledBtn>
        <StyledBtn>Remove option</StyledBtn>
      </div>
    </Fragment>
  );
};

export default OptionsBody;
