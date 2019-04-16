import React, { CSSProperties, useRef, useState, createContext } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import OptionsDropdown from "./Answer/Options";
import { MutationFn } from "react-apollo";
import { QuestionFieldsFragment } from "GqlClient/autoGenTypes";
import Answer from "./Answer";
import { Row } from "./Row";
import Question from "./Question";

// export { AnsweredQuestionConsumer };

const StyledQuestion = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid white;
  margin-bottom: 2em;
  flex-direction: column;
  align-items: center;
`;

type AnsweredQuestion = RequireAndNotNullSome<QuestionFieldsFragment, "answer">;

type AnsweredQuestionProps = {
  question: AnsweredQuestion;
  showComments: boolean;
  // onRemove: () => Promise<void>;
  scrollToComment?: string;
  editionId?: string;
  totalQuestionsCount: number;
  isPersonal: boolean;
  style?: CSSProperties;
};
export const AnsweredQuestionContext = createContext<AnsweredQuestion | null>(
  null
);

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
    <AnsweredQuestionContext.Provider value={props.question}>
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
          editionId={props.editionId}
        />
      </StyledQuestion>
    </AnsweredQuestionContext.Provider>
  );
};

export default AnsweredQuestion;
