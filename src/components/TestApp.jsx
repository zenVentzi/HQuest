import React, { Fragment } from 'react';
import styled from 'styled-components';

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 70px auto;
  align-items: center;
  text-align: center;
  width: 500px;
  border: 3px solid red;
  overflow: hidden;
`;

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;
  width: 50%;
  border: 3px solid black;
`;

const StyledQuestion = styled.div`
  border: 3px solid black;
  /* width: 100%; */
`;

const StyledP = styled.p`
  border: 3px solid black;
`;

const App = () => {
  const test = 5;

  return (
    <StyledView>
      <StyledQuestionsContainer>
        <p> 123456 </p>
      </StyledQuestionsContainer>
    </StyledView>
  );
  // return (
  //   <StyledView>
  //     <StyledP> 123456 </StyledP>
  //   </StyledView>
  // );
};

export default App;
