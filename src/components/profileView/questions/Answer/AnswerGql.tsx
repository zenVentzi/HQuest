import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import {
  EDIT_ANSWER,
  REMOVE_ANSWER,
  MOVE_ANSWER_POSITION,
  LIKE_ANSWER_EDITION
} from "GqlClient/question/answer/mutations";
import {
  EditAnswerMutation,
  EditAnswerVariables,
  RemoveAnswerMutation,
  RemoveAnswerVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionVariables,
  LikeAnswerEditionMutation,
  LikeAnswerEditionVariables
} from "GqlClient/autoGenTypes";

interface AnswerGqlProps {
  children: (
    editAnswer: MutationFn<EditAnswerMutation, EditAnswerVariables>,
    // removeAnswer: MutationFn<RemoveAnswerMutation, RemoveAnswerVariables>,
    moveAnswerPosition: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionVariables
    >,
    likeAnswerEdition: MutationFn<
      LikeAnswerEditionMutation,
      LikeAnswerEditionVariables
    >
  ) => React.ReactChild;
}

const AnswerGql = (props: AnswerGqlProps) => {
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
                      <Mutation<
                        LikeAnswerEditionMutation,
                        LikeAnswerEditionVariables
                      >
                        mutation={LIKE_ANSWER_EDITION}
                      >
                        {likeAnswerEdition => {
                          return children(
                            editAnswer,
                            // removeAnswer,
                            moveAnswerPosition,
                            likeAnswerEdition
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

export default AnswerGql;
