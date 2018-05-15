import React from 'react';
import styled from 'styled-components';
import Question from './Question';

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;`;

const QuestionsContainer = (props) => {
  const renderQuestions = () => {
    // = pros.questionIds.map

    const tempIds = [1];
    const questions = tempIds.map(id => (
      <Question
        key={id}
        questionId={id}
      />
    ));

    return questions;
  };

  return (
    <StyledQuestionsContainer>
      {renderQuestions()}
    </StyledQuestionsContainer>
  );
};

export default QuestionsContainer;
