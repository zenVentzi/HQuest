import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import ScaleBody from './ScaleBody';
import TextBody from './TextBody';
import OptionsBody from './OptionsBody';
import WouldYouSingleBody from './WouldYouSingleBody';
import { QuestionTypes } from './constants';

const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestionMutation(
    $question: String!
    $type: QuestionType!
    $possibleAnswers: [String!]
  ) {
    createQuestion(
      question: $question
      type: $type
      possibleAnswers: $possibleAnswers
    )
  }
`;

const CreateBtn = styled.button`
  margin-top: 0.5em;
`;

class QuestionBody extends Component {
  state = { body: null };

  onCreate = createQuestion => async () => {
    const { body } = this.state;
    const { questionType } = this.props;

    const variables = {
      question: body.question,
      type: questionType,
      possibleAnswers: body.possibleAnswers,
    };

    await createQuestion({ variables });
    this.props.onAdded();
  };

  onBodyChange = body => {
    this.setState({ body });
  };

  render() {
    const { questionType } = this.props;

    const {
      SCALE,
      TEXT,
      OPTIONS,
      WOULD_YOU_SINGLE,
      WOULD_YOU_DOUBLE,
    } = QuestionTypes;

    let Body;

    switch (questionType) {
      case SCALE:
        Body = ScaleBody;
        break;
      case TEXT:
        Body = TextBody;
        break;
      case OPTIONS:
        Body = OptionsBody;
        break;
      case WOULD_YOU_SINGLE:
        Body = WouldYouSingleBody;
        break;
      case WOULD_YOU_DOUBLE:
        break;
      default:
        return null;
    }

    return (
      <Mutation mutation={CREATE_QUESTION_MUTATION}>
        {createQuestion => {
          return (
            <Fragment>
              <Body onChange={this.onBodyChange} />
              <CreateBtn onClick={this.onCreate(createQuestion)}>
                Create
              </CreateBtn>
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default QuestionBody;
