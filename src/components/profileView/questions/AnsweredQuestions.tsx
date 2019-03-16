import React, { Fragment, CSSProperties } from "react";
import styled from "styled-components";
import AnsweredQuestion from "./AnsweredQuestion";
import { QuestionFieldsFragment } from "GqlClient/autoGenTypes";
import { withPropsChecker } from "Utils";

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

interface AnsweredQuestionsProps {
  isPersonal: boolean;
  questions: QuestionFieldsFragment[];
  totalCount: number;
  refetch: any;
  // couldn't add the style type
}

const AnsweredQuestions = ({
  isPersonal,
  questions,
  totalCount,
  refetch,
  ...style
}: AnsweredQuestionsProps) => {
  if (!questions.length) {
    return <Empty style={style}> No answered questions </Empty>;
  }

  return (
    <>
      {questions.map(q => (
        <AnsweredQuestion
          key={q.id}
          showComments={true}
          style={style}
          isPersonal={isPersonal}
          question={q}
          totalQuestionsCount={totalCount}
        />
      ))}
    </>
  );
};

// export default AnsweredQuestions;
export default AnsweredQuestions;
