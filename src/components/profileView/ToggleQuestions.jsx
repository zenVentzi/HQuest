import React from 'react';
import styled from 'styled-components';
import ToggleBtn from '../reusable/ToggleBtn';

const Wrapper = styled.div`
  margin-top: 10px;`;

const ToggleQuestions = () => (
  <Wrapper>
    <ToggleBtn
      onText="Unanswered"
      offText="Answered"
    />
  </Wrapper>
);

export default ToggleQuestions;
