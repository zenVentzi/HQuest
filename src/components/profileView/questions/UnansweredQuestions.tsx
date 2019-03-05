import React, { CSSProperties } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import UnansweredQuestion from "./UnansweredQuestion";
import { QuestionFieldsFragment } from "GqlClient/autoGenTypes";

interface UnansweredQuestionsProps {
  style?: CSSProperties;
  questions: QuestionFieldsFragment[];
  refetchQuestions: () => Promise<void>;
}

const UnansweredQuestions = ({
  style,
  questions,
  refetchQuestions
}: UnansweredQuestionsProps) => {
  if (!questions.length) {
    return <div style={style}> All questions are answered </div>;
  }

  return (
    <>
      {questions.map(q => (
        <UnansweredQuestion
          key={q.id}
          style={style}
          question={q}
          refetchQuestions={refetchQuestions}
        />
      ))}
    </>
  );
};

export default UnansweredQuestions;
