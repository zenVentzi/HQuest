import React, { useRef, useState, useEffect } from "react";
import AnsweredQuestions from "./AnsweredQuestions";
import QuestionTags from "./Tags";
import UnansweredQuestions from "./UnansweredQuestions";
import ToggleQuestions from "./ToggleQuestions";
import { UserFieldsFragment } from "GqlClient/autoGenTypes";

interface QuestionsContainerProps {
  user: UserFieldsFragment;
}

const QuestionsContainer = (props: QuestionsContainerProps) => {
  const [showAnswered, setShowAnswered] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>();

  const onToggleQuestions = (e: any) => {
    const isTogglerOn = e.target.checked;
    setShowAnswered(!isTogglerOn);
  };

  const onSelectedTags = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const { user } = props;

  return (
    <>
      {user.me && <ToggleQuestions onClick={onToggleQuestions} />}
      <QuestionTags onSelected={onSelectedTags} />
      {showAnswered ? (
        <AnsweredQuestions
          user={props.user}
          selectedTags={selectedTags}
          isPersonal={!!props.user.me}
        />
      ) : (
        <UnansweredQuestions user={props.user} selectedTags={selectedTags} />
      )}
    </>
  );
};

export default QuestionsContainer;
