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
  EditAnswerMutationVariables,
  RemoveAnswerMutation,
  RemoveAnswerMutationVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionMutationVariables,
  LikeAnswerEditionMutation,
  LikeAnswerEditionMutationVariables
} from "GqlClient/autoGenTypes";

interface AnswerGqlProps {
  children: (
    editAnswer: MutationFn<EditAnswerMutation, EditAnswerMutationVariables>,
    moveAnswerPosition: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionMutationVariables
    >,
    likeAnswerEdition: MutationFn<
      LikeAnswerEditionMutation,
      LikeAnswerEditionMutationVariables
    >
  ) => React.ReactElement;
}

const AnswerGql = (props: AnswerGqlProps) => {
  const { children } = props;

  // wtf really apollo level pre-japanese
  // in bulgarian- eб* мааму
  return (
    <Mutation<EditAnswerMutation, EditAnswerMutationVariables>
      mutation={EDIT_ANSWER}
    >
      {editAnswer => {
        return (
          <Mutation<RemoveAnswerMutation, RemoveAnswerMutationVariables>
            mutation={REMOVE_ANSWER}
          >
            {removeAnswer => {
              return (
                <Mutation<
                  MoveAnswerPositionMutation,
                  MoveAnswerPositionMutationVariables
                >
                  mutation={MOVE_ANSWER_POSITION}
                >
                  {moveAnswerPosition => {
                    return (
                      <Mutation<
                        LikeAnswerEditionMutation,
                        LikeAnswerEditionMutationVariables
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
