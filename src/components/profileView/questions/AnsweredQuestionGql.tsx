import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import {
  EDIT_ANSWER,
  REMOVE_ANSWER,
  MOVE_ANSWER_POSITION,
  LIKE_ANSWER
} from "GqlClient/question/answer/mutations";

interface AnsweredQuestionGqlProps {
  children: (
    editAnswer: MutationFn,
    removeAnswer: MutationFn,
    moveAnswerPosition: MutationFn,
    likeAnswer: MutationFn
  ) => any;
}

const AnsweredQuestionGql = (props: AnsweredQuestionGqlProps) => {
  const { children } = props;

  // wtf really apollo level pre-japanese
  // in bulgarian- eб* мааму
  return (
    <Mutation mutation={EDIT_ANSWER}>
      {editAnswer => {
        return (
          <Mutation mutation={REMOVE_ANSWER}>
            {removeAnswer => {
              return (
                <Mutation mutation={MOVE_ANSWER_POSITION}>
                  {moveAnswerPosition => {
                    return (
                      <Mutation mutation={LIKE_ANSWER}>
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
