import React from "react";
import { Query } from "react-apollo";
import { GET_ANSWERED_QUESTION } from "GqlClient/question/queries";
import AnsweredQuestion from "./questions/AnsweredQuestion";
import { RouteComponentProps } from "react-router";

interface QuestionPinProps
  extends RouteComponentProps<{ id: string; questionId: string }> {
  editable: boolean;
}

const QuestionPin = ({
  match: {
    params: { id: userId, questionId }
  },
  editable
}: QuestionPinProps) => {
  const vars = { userId, questionId };

  // return <div>comment pin</div>;

  return (
    <Query query={GET_ANSWERED_QUESTION} variables={vars}>
      {({ loading, error, data: { answeredQuestion: q } }) => {
        if (loading) {
          return <div>Loading question..</div>;
        } else if (error) {
          return <div>{error}</div>;
        }

        return (
          <AnsweredQuestion
            showComments
            isPersonal={editable}
            totalQuestionsCount={0} // FIXME: fix that shit
            question={q}
          />
        );
      }}
    </Query>
  );
};

export default QuestionPin;
