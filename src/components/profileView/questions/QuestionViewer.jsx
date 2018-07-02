import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Scale from './Answer/Scale';
import update, { REMOVE_QUESTION } from './CacheHelper';

const REMOVE_QUESTION_GQL = gql`
  mutation removeQuestion($questionId: ID!) {
    removeQuestion(questionId: $questionId) {
      id
      type
      possibleValues
      value
    }
  }
`;

const QuestionViewer = props => {
  const onClickRemove = mutate => async () => {
    const variables = {
      questionId: props.question.id,
    };

    mutate({ variables, update: update(props.userId, REMOVE_QUESTION) });
  };

  return (
    <Mutation mutation={REMOVE_QUESTION_GQL}>
      {removeQuestion => {
        const question = props.question.value;
        const values = props.question.possibleValues;
        const { value } = props.question.answer;
        const { hovered, onClickEdit } = props;

        return (
          <Fragment>
            <p> {question} </p>
            <Scale viewMode values={values} value={value} />
            <Btn onClick={onClickEdit} visible={hovered}>
              Edit
            </Btn>
            <Btn onClick={onClickRemove(removeQuestion)} visible={hovered}>
              Remove
            </Btn>
          </Fragment>
        );
      }}
    </Mutation>
  );
};

export default QuestionViewer;
