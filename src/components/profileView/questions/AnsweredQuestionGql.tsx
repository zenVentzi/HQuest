import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import {
  EDIT_ANSWER,
  REMOVE_ANSWER,
  MOVE_ANSWER_POSITION,
  LIKE_ANSWER
} from "GqlClient/question/answer/mutations";
import {
  EditAnswerMutation,
  EditAnswerVariables,
  RemoveAnswerMutation,
  RemoveAnswerVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionVariables,
  LikeAnswerMutation,
  LikeAnswerVariables
} from "GqlClient/autoGenTypes";

interface AnsweredQuestionGqlProps {
  children: (
    editAnswer: MutationFn<EditAnswerMutation, EditAnswerVariables>,
    removeAnswer: MutationFn<RemoveAnswerMutation, RemoveAnswerVariables>,
    moveAnswerPosition: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionVariables
    >,
    likeAnswer: MutationFn<LikeAnswerMutation, LikeAnswerVariables>
  ) => any;
}

const AnsweredQuestionGql = (props: AnsweredQuestionGqlProps) => {
  const { children } = props;

  // wtf really apollo level pre-japanese
  // in bulgarian- eб* мааму
  return (
    <Mutation<EditAnswerMutation, EditAnswerVariables> mutation={EDIT_ANSWER}>
      {editAnswer => {
        return (
          <Mutation<RemoveAnswerMutation, RemoveAnswerVariables>
            mutation={REMOVE_ANSWER}
          >
            {removeAnswer => {
              return (
                <Mutation<
                  MoveAnswerPositionMutation,
                  MoveAnswerPositionVariables
                >
                  mutation={MOVE_ANSWER_POSITION}
                >
                  {moveAnswerPosition => {
                    return (
                      <Mutation<LikeAnswerMutation, LikeAnswerVariables>
                        mutation={LIKE_ANSWER}
                      >
                        {likeAnswer => {
                          return children(
                            editAnswer,
                            removeAnswer,
                            moveAnswerPosition,
                            likeAnswer
                          );
                        }}
                      </Mutation>
                    );
                  }}
                </Mutation>
              );
            }}
          </Mutation>
        );
      }}
    </Mutation>
  );
};

export default AnsweredQuestionGql;
