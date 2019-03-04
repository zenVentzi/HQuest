import React, { CSSProperties } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import UnansweredQuestion from "./UnansweredQuestion";

interface UnansweredQuestionsProps {
  style?: CSSProperties;
  questions: any[];
  refetchQuestions: () => Promise<any>;
}

const UnansweredQuestions = (props: UnansweredQuestionsProps) => {
  const { style, questions, refetchQuestions } = props;

  if (!questions.length) {
    return <div style={style}> All questions are answered </div>;
  }

  return questions.map(q => (
    <UnansweredQuestion
      key={q.id}
      style={style}
      question={q}
      refetchQuestions={refetchQuestions}
    />
  ));
};

export default UnansweredQuestions;
