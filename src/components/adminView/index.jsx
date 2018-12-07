import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Formik, Form, ErrorMessage } from 'formik';
import { Mutation } from 'react-apollo';
import { ADD_QUESTIONS } from 'Mutations';
// import StyledView from '../reusable/StyledView';
import TextBtn from 'Reusable/TextBtn';

const TextArea = styled.textarea`
  margin-bottom: 1em;
  overflow: hidden;
  width: 95%;
`;

// use the one from Reusable
const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 70px auto;
  align-items: center;
  text-align: center;
  width: 500px;
  overflow: hidden;
`;

const AdminView = () => {
  const getTags = ({ tagsText }) => {
    const init = tagsText.indexOf('(');
    const fin = tagsText.indexOf(')');
    const commaSeparated = tagsText.substring(init + 1, fin);
    const tagsArr = commaSeparated.split(',');
    return tagsArr;
  };

  const getFormattedQuestions = ({ questionsText }) => {
    const rawQuestions = questionsText.split(';NEW_QUESTION;');

    // raw question = How do you...?;TAGS(tag1,tag2,..);;NEW_QUESTION;

    const questions = rawQuestions.map(rawQuestion => {
      let question;
      try {
        const value = rawQuestion.split(';')[0];
        const tagsText = rawQuestion.split(';')[1];
        const tags = getTags({ tagsText });
        question = { value, tags };
      } catch (error) {
        throw new Error(`Incorrect format: ${rawQuestion}`);
      }

      return question;
    });

    return questions;
  };

  return (
    <StyledView>
      <Mutation mutation={ADD_QUESTIONS}>
        {addQuestions => {
          return (
            <Formik
              initialValues={{ questionsText: '' }}
              validateOnBlur={false}
              validate={values => {
                const errors = {};
                return errors;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const { questionsText } = values;

                const questions = getFormattedQuestions({
                  questionsText,
                });
                const variables = { questions };
                await addQuestions({ variables });

                setSubmitting(false);
                resetForm({});
              }}
            >
              {({
                touched,
                values,
                errors,
                handleChange,
                submitForm,
                isSubmitting,
              }) => (
                <Form style={{ width: '100%', textAlign: 'center' }}>
                  <TextArea
                    name="questionsText"
                    onChange={handleChange}
                    value={values.questionsText || ''}
                    disabled={isSubmitting}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isSubmitting) submitForm();
                      }
                    }}
                    placeholder="Enter the questions string here"
                  />
                  <TextBtn onClick={submitForm}>Add</TextBtn>
                </Form>
              )}
            </Formik>
          );
        }}
      </Mutation>
    </StyledView>
  );
};

export default AdminView;
