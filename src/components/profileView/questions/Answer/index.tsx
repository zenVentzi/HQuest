import React, { useState, useRef, useEffect } from "react";
import { useAsyncEffect } from "use-async-effect";
import {
  QuestionFieldsAnswer,
  EditAnswerMutation,
  EditAnswerVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionVariables,
  LikeAnswerMutation,
  LikeAnswerVariables,
  RemoveAnswerMutation,
  RemoveAnswerVariables
} from "GqlClient/autoGenTypes";
import { toast } from "react-toastify";
import { getLoggedUserId } from "Utils";
import { MutationFn } from "react-apollo";
import AnswerViewer from "./AnswerViewer";
import AnswerEditor from "./AnswerEditor";
import LikeBtn from "./LikeBtn";
import AnswerGql from "./AnswerGql";
import PositionEditor from "./PositionEditor";
import { Row } from "../Row";

import styled from "styled-components";
import Likes from "./Likes";
import Comments from "./Comments";
import EditionDropdown from "./EditionDropdown";
import Editions from "./Editions";

interface AnswerProps {
  showAnswerEditor: boolean;
  showPositionEditor: boolean;
  remove: boolean;
  answer: QuestionFieldsAnswer;
  totalQuestionsCount: number;
  showComments: boolean;
  onCloseAnswerEditor: () => void;
  onClosePositionEditor: () => void;
  scrollToComment?: string;
}

const Answer = (props: AnswerProps) => {
  // const { viewMode, answer, showPositionEditor } = props;
  const removeMutation = useRef<
    MutationFn<RemoveAnswerMutation, RemoveAnswerVariables>
  >();

  useAsyncEffect(
    async () => {
      if (props.remove) {
        const answerId = props.answer!.id;
        const variables = { answerId };
        await removeMutation.current!({ variables });
        toast.success("Answer removed!");
      }
    },
    () => {},
    [props.remove]
  );

  const onSaveAnswer = (
    mutation: MutationFn<EditAnswerMutation, EditAnswerVariables>
  ) => async (answerValue: string) => {
    const lastEdition = props.answer!.editions[
      props.answer!.editions.length - 1
    ];
    const isTheSame = lastEdition.value === answerValue;

    if (isTheSame) {
      // closeAnswerEditor();
      // setViewMode(true);
      props.onCloseAnswerEditor();
      toast.success("No changes");
      return;
    }

    const answerId = props.answer!.id;
    const variables = { answerId, answerValue };
    await mutation({ variables });
    toast.success("Answer edited!");

    // setNumOfEditions(numOfEditions + 1);
    // closeAnswerEditor();
    props.onCloseAnswerEditor();
  };

  const onMovePosition = (
    mutation: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionVariables
    >
  ) => async (newPosition: number) => {
    const answerId = props.answer!.id;
    const variables = { answerId, position: newPosition };
    await mutation({ variables });
    // await props.onClickMove({ newPosition });
    toast.success("Answer moved!");
    props.onClosePositionEditor();
  };

  return (
    <AnswerGql>
      {(editAnswer, removeAnswer, moveAnswerPosition, likeAnswer) => {
        removeMutation.current = removeAnswer;
        return (
          <>
            {props.showAnswerEditor ? (
              <AnswerEditor
                answer={props.answer}
                onClickDoesNotApply={() => {}}
                onClickSave={onSaveAnswer(editAnswer)}
              />
            ) : (
              <Editions editions={props.answer.editions} />
            )}
            {props.showPositionEditor && (
              <PositionEditor
                position={props.answer!.position}
                maxPosition={props.totalQuestionsCount}
                onClickMove={onMovePosition(moveAnswerPosition)}
                onClickClose={props.onClosePositionEditor}
              />
            )}
          </>
        );
      }}
    </AnswerGql>
  );
};

export default Answer;
