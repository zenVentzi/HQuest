import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { CREATE_QUESTION_MUTATION } from 'Mutations';
import styled from 'styled-components';
import ScaleBody from './ScaleBody';
import TextBody from './TextBody';
import OptionsBody from './OptionsBody';
import { QuestionTypes } from './constants';

const CreateBtn = styled.button`
  margin-top: 0.5em;
`;

class QuestionBody extends Component {
  state = { questionValues: null };
  tagsInputRef = React.createRef();

  onCreate = createQuestion => async () => {
    const { questionValues } = this.state;
    const { questionType } = this.props;
    const tags = this.tagsInputRef.current.value.replace(/ /g, '').split(',');

    const variables = {
      question: questionValues.question,
      type: questionType,
      defaultAnswer: questionValues.defaultAnswer,
      possibleAnswers: questionValues.possibleAnswers,
      tags,
    };

    await createQuestion({ variables });
    this.props.onAdded();
  };

  onQuestionValuesChange = questionValues => {
    this.setState({ questionValues });
  };

  render() {
    const { questionType } = this.props;

    const { SCALE, TEXT, OPTIONS, WOULD_YOU_SINGLE } = QuestionTypes;

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
      default:
        return null;
    }

    return (
      <Mutation mutation={CREATE_QUESTION_MUTATION}>
        {createQuestion => {
          return (
            <Fragment>
              <Body onChange={this.onQuestionValuesChange} />
              <p>
                Tags: <br />
                <input ref={this.tagsInputRef} type="text" />{' '}
              </p>
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
