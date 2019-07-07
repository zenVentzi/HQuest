import React from "react";
import styled from "styled-components";
import ToggleBtn from "Reusable/ToggleBtn";

const Wrapper = styled.div`
  margin-bottom: 0.5em;
`;

interface ToggleQuestionsProps {
  onClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
}

const ToggleQuestions = (props: ToggleQuestionsProps) => (
  <Wrapper>
    <ToggleBtn onText="Unanswered" offText="Answered" onClick={props.onClick} />
  </Wrapper>
);

export default ToggleQuestions;
