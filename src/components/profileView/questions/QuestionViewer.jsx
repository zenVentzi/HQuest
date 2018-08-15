import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Scale from './Answer/Scale';
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
        const question = props.question.value;
        const values = props.question.possibleValues;
        const { value } = props.question.answer;
        const { hovered, onClickEdit, showButtons } = props;

        return (
          <Fragment>
            <p> {question} </p>
            <Scale viewMode values={values} value={value} />
            {showButtons && (
              <Fragment>
                <Btn onClick={onClickEdit} visible={hovered}>
                  Edit
                </Btn>
                <Btn onClick={onClickRemove(removeQuestion)} visible={hovered}>
                  Remove
                </Btn>
              </Fragment>
            )}
          </Fragment>
        );
      }}
    </Mutation>
  );
};

export default QuestionViewer;
