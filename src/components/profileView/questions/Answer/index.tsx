import React, { useState, useRef, useEffect, memo, createContext } from "react";
import { useAsyncEffect } from "use-async-effect";
import {
  AnswerFieldsFragment,
  EditAnswerMutation,
  EditAnswerMutationVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionMutationVariables,
  RemoveAnswerMutation,
  RemoveAnswerMutationVariables
} from "GqlClient/autoGenTypes";
import { toast } from "react-toastify";
import { MutationFn } from "react-apollo";
import AnswerEditor from "./AnswerEditor";
import AnswerGql from "./AnswerGql";
import PositionEditor from "./PositionEditor";
import Editions from "./Editions";
import { deepEqual, withPropsChecker } from "Utils";

interface AnswerProps {
  showAnswerEditor: boolean;
  showPositionEditor: boolean;
  remove: boolean;
  answer: AnswerFieldsFragment;
  totalQuestionsCount: number;
  showComments: boolean;
  onCloseAnswerEditor: () => void;
  onClosePositionEditor: () => void;
  scrollToComment?: string;
  editionId?: string;
}

const Answer = (props: AnswerProps) => {
  const editorInputRef = useRef<HTMLTextAreaElement>(null);
  // const { viewMode, answer, showPositionEditor } = props;
  const removeMutation = useRef<
    MutationFn<RemoveAnswerMutation, RemoveAnswerMutationVariables>
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
    mutation: MutationFn<EditAnswerMutation, EditAnswerMutationVariables>
  ) => async (
    answerValue: string,
    mentionedUserIds: string[] | null | undefined
  ): Promise<void> => {
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
    const variables: EditAnswerMutationVariables = {
      answerId,
      answerValue,
      mentionedUsers: mentionedUserIds
    };
    await mutation({ variables });
    toast.success("Answer edited!");

    // setNumOfEditions(numOfEditions + 1);
    // closeAnswerEditor();
    props.onCloseAnswerEditor();
  };

  const onMovePosition = (
    mutation: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionMutationVariables
    >
  ) => async (newPosition: number) => {
    const answerId = props.answer!.id;
    const variables = { answerId, position: newPosition };
    await mutation({ variables });
    // await props.onClickMove({ newPosition });
    toast.success("Answer moved!");
    props.onClosePositionEditor();
  };

  // console.log(props.answer.editions);

  return (
    <AnswerGql>
      {(editAnswer, moveAnswerPosition, likeAnswerEdition) => {
        return (
          <>
            {props.showAnswerEditor ? (
              <AnswerEditor
                ref={editorInputRef}
                answer={props.answer}
                onClickDoesNotApply={() => {}}
                onClickSave={onSaveAnswer(editAnswer)}
              />
            ) : props.showPositionEditor ? (
              <PositionEditor
                position={props.answer!.position}
                maxPosition={props.totalQuestionsCount}
                onClickMove={onMovePosition(moveAnswerPosition)}
                onClickClose={props.onClosePositionEditor}
              />
            ) : (
              <Editions
                selectedEditionId={props.editionId}
                editions={props.answer.editions}
                answerId={props.answer.id}
                likeEdition={likeAnswerEdition}
              />
            )}
          </>
        );
      }}
    </AnswerGql>
  );
};

// export default withPropsChecker(memo(Answer, deepEqual), "Answer");
export default memo(Answer, deepEqual);
// export default Answer;
