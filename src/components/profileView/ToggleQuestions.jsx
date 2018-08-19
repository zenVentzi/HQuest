import React from 'react';
import styled from 'styled-components';
import ToggleBtn from '../reusable/ToggleBtn';

const Wrapper = styled.div`
  margin-bottom: 1em;
`;

const ToggleQuestions = props => (
  <Wrapper>
    <ToggleBtn onText="Unanswered" offText="Answered" onClick={props.onClick} />
  </Wrapper>
);

export default ToggleQuestions;
