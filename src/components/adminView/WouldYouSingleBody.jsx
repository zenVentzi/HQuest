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
  width: 90%;
`;

const WouldYouBody = () => {
  const test = 5;

  return (
    <Fragment>
      <Value placeholder="would you.." />
      <Value placeholder="but.." />
    </Fragment>
  );
};

export default WouldYouBody;
