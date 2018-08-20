import React, { Fragment } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Answer from './Answer';
import QuestionText from './QuestionText';
import update, { CACHE_ACTIONS } from './CacheHelper';
import Reactions from './Reactions';
import Comments from './Comments';

const REMOVE_ANSWER = gql`
  mutation removeAnswer($answerId: ID!) {
    removeAnswer(answerId: $answerId) {
      userId
      questionId
    }
  }
`;

const Span = styled.span`
  cursor: pointer;
  margin: 1em 0.6em;
  font-size: 0.7em;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
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
            <Comments />
            <QuestionText> {question.question} </QuestionText>
            <Answer viewMode question={question} />
            <div>
              <Span>15 Reactions</Span>
              <Span>2 Comments</Span>
            </div>
            {/* showButtons */ false && (
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
