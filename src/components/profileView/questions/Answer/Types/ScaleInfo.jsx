import React from 'react';
import styled from 'styled-components';

const StyledInfo = styled.div`
  background: white;
  border-radius: 0.2em;
  padding: 1em;
  color: black;

  ol {
    padding-left: 0.5em;
    color: black;
  }

  ol li {
    color: black;
    list-style-type: decimal; /* or 'decimal-leading-zero', 'upper-alpha', 'lower-alpha'... */
    list-style-position: outside; /* or 'inside' */
    margin-left: 1em; /* gives 'room' for the numbers to appear in */
  }
`;

const ScaleInfo = ({ possibleAnswers }) => (
  <StyledInfo>
    Possible answers:
    <ol>
      {possibleAnswers.map(pa => (
        <li key={pa}>{pa}</li>
      ))}
    </ol>
  </StyledInfo>
);

export default ScaleInfo;
