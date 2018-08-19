import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Answer from './Answer';
import QuestionText from './QuestionText';
import update, { CACHE_ACTIONS } from './CacheHelper';

const REMOVE_ANSWER = gql`
  mutation removeAnswer($answerId: ID!) {
    removeAnswer(answerId: $answerId) {
      userId
      questionId
    }
  }
`;

const QuestionViewer = props => {
  const onClickRemove = mutate => async () => {
    mutate({
      variables: {
        answerId: props.question.answer.id,
      },
      update: update(CACHE_ACTIONS.REMOVE_ANSWER),
    });
  };

  return (
    <Mutation mutation={REMOVE_ANSWER}>
      {removeQuestion => {
        const { hovered, onClickEdit, showButtons, question } = props;

        return (
          <Fragment>
            <QuestionText> {question.question} </QuestionText>
            <Answer viewMode question={question} />
            {showButtons && (
              <div>
                <Btn onClick={onClickEdit} visible={hovered}>
                  Edit
                </Btn>
                <Btn onClick={onClickRemove(removeQuestion)} visible={hovered}>
                  Remove
                </Btn>
              </div>
            )}
          </Fragment>
        );
      }}
    </Mutation>
  );
};

export default QuestionViewer;
