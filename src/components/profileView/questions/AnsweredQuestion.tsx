import React, { CSSProperties, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Question from "./Question";
import OptionsDropdown from "./Answer/Options";
import { MutationFn } from "react-apollo";
import {
  QuestionFieldsFragment,
  RemoveAnswerMutation,
  RemoveAnswerVariables
} from "GqlClient/autoGenTypes";
import Answer from "./Answer";
import { Row } from "./Row";

const StyledQuestion = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid white;
  margin-bottom: 2em;
  flex-direction: column;
  align-items: center;
`;

interface AnsweredQuestionProps {
  question: QuestionFieldsFragment;
  // question: Required<QuestionFieldsFragment>;
  showComments: boolean;
  // onRemove: () => Promise<void>;
  scrollToComment?: string;
  totalQuestionsCount: number;
  isPersonal: boolean;
  style?: CSSProperties;
}

const AnsweredQuestion = (props: AnsweredQuestionProps) => {
  const [hovered, setHovered] = useState(false);
  const [removeAnswer, setRemoveAnswer] = useState(false);
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [showPositionEditor, setShowPositionEditor] = useState(false);

  const onMouseEnter = () => {
    setHovered(true);
  };

  const onMouseLeave = () => {
    setHovered(false);
  };

  const {
    question,
    scrollToComment,
    totalQuestionsCount,
    isPersonal,
    style,
    showComments
  } = props;

  return (
    <StyledQuestion
      onMouseEnter={onMouseEnter}
      onFocus={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onBlur={onMouseLeave}
      style={style}
    >
      <Row>
        <Question question={question.value} />
        <OptionsDropdown
          visible={isPersonal && hovered}
          onClickEdit={() => {
            if (showPositionEditor) return;
            setShowAnswerEditor(true);
          }}
          // onClickRemove={() => {
          //   setRemoveAnswer(true);
          // }}
          onClickMove={() => {
            if (showAnswerEditor) return;
            setShowPositionEditor(true);
          }}
        />
      </Row>
      <Answer
        showAnswerEditor={showAnswerEditor}
        onCloseAnswerEditor={() => {
          setShowAnswerEditor(false);
        }}
        remove={removeAnswer}
        showPositionEditor={showPositionEditor}
        onClosePositionEditor={() => {
          setShowPositionEditor(false);
        }}
        answer={question.answer!}
        totalQuestionsCount={totalQuestionsCount}
        showComments={showComments}
        scrollToComment={scrollToComment}
      />
    </StyledQuestion>
  );
};

export default AnsweredQuestion;
