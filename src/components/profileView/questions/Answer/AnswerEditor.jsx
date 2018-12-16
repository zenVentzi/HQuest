import React, { Component, Fragment } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import Textarea from 'react-textarea-autosize';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const TextArea = styled(Textarea)`
  display: block;
  margin: 1em auto;
  text-align: center;
  /* margin-left: auto; */
  margin-bottom: 1em;
  overflow: hidden;
  width: 50%;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 1em;
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 0.5em;
`;

const LeftBtn = styled(TextBtn)`
  margin-right: 1em;
`;
const RightBtn = styled(TextBtn)``;

class AnswerEditor extends Component {
  checkLastCharsEqual = ({ text, last, equalChar }) => {
    if (text.length < last) {
      return false;
    }

    const lastChars = text.slice(-last).split('');
    return lastChars.filter(ch => ch === equalChar).length === last;
  };

  minimizeNewlines = ({ newValue, oldValue }) => {
    // const oldValue = this.state.answerValue;

    if (
      this.checkLastCharsEqual({ text: newValue, last: 3, equalChar: '\n' })
    ) {
      return oldValue;
    }

    return newValue;
  };

  onClickSave = () => {};

  onDoesNotApply = () => {
    this.props.onClickDoesNotApply();
  };

  render() {
    const isNew = !this.props.answer;
    const initialValues = { answer: '' };
    if (!isNew) {
      initialValues.answer = this.props.answer.value;
    }

    return (
      <Formik
        initialValues={initialValues}
        validateOnBlur={false}
        validate={values => {
          const errors = {};
          if (values.answer.length < 10)
            errors.answer = 'Answer must be at least 10 characters';

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const answerValue = values.answer.trim();
          resetForm(initialValues);
          setSubmitting(false);
          await this.props.onClickSave({ answerValue });
        }}
      >
        {({ values, handleChange, submitForm, isSubmitting }) => (
          <Form style={{ width: '100%', textAlign: 'center' }}>
            <TextArea
              name="answer"
              placeholder="Answer..."
              onChange={e => {
                e.target.value = this.minimizeNewlines({
                  newValue: e.target.value,
                  oldValue: values.answer,
                });
                handleChange(e);
              }}
              value={values.answer || ''}
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="answer"
              render={msg => <ErrorText>{msg}</ErrorText>}
            />
            <Buttons>
              <LeftBtn onClick={submitForm}>Save</LeftBtn>
              {isNew && (
                <RightBtn onClick={this.onClickDoesNotApply}>
                  Does not apply
                </RightBtn>
              )}
            </Buttons>
          </Form>
        )}
      </Formik>
    );
  }
}

export default AnswerEditor;
