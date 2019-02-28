import React, { Component } from "react";
import { Mutation, MutationFn } from "react-apollo";
import { ADD_ANSWER, QUESTION_NOT_APPLY } from "graphql/gqlMutations";

interface UnansweredQuestionGqlProps {
  children: (addAnswer: MutationFn, questionNotApply: MutationFn) => any;
}

class UnansweredQuestionGql extends Component<UnansweredQuestionGqlProps> {
  render() {
    const { children } = this.props;

    return (
      <Mutation mutation={ADD_ANSWER}>
        {addAnswer => {
          return (
            <Mutation mutation={QUESTION_NOT_APPLY}>
              {questionNotApply => {
                return children(addAnswer, questionNotApply);
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default UnansweredQuestionGql;
