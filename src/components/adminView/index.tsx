import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { Formik, Form, ErrorMessage } from "formik";
import { Mutation } from "react-apollo";
import Auto_resize_Textarea from "react-textarea-autosize";
import { ADD_QUESTIONS } from "GqlClient/question/mutations";
// import StyledView from '../reusable/StyledView';
import TextBtn from "Reusable/TextBtn";
import {
  AddQuestionsMutation,
  AddQuestionsMutationVariables,
  InputQuestion
} from "GqlClient/autoGenTypes";

const TextArea = styled(Auto_resize_Textarea)`
  margin-bottom: 1em;
  overflow: hidden;
  width: 95%;
  word-break: break-all;
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
  const getTags = (tagsText: string) => {
    const init = tagsText.indexOf("(");
    const fin = tagsText.indexOf(")");
    const commaSeparated = tagsText.substring(init + 1, fin);
    const tagsArr = commaSeparated.split(",");
    return tagsArr;
  };

  const getFormattedQuestions = (questionsText: string): InputQuestion[] => {
    const questions = questionsText
      .trim()
      .split(/;TAGS\(\S+\);/g)
      .filter(question => question.length > 3);

    let unformattedTags = questionsText.trim().match(/;TAGS\(\S+\);/g);
    if (!unformattedTags) {
      throw Error(`Couldn't parse questions`);
    }
    unformattedTags = unformattedTags.filter(question => question.length > 3);
    const tags = unformattedTags.map(t => getTags(t));
    if (tags.length !== questions.length) {
      throw Error(`Eeach question must have tags`);
    }

    const combined: InputQuestion[] = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < questions.length; i++) {
      combined.push({ tags: tags[i], value: questions[i] });
    }

    return combined;
  };

  return (
    <StyledView>
      <Mutation<AddQuestionsMutation, AddQuestionsMutationVariables>
        mutation={ADD_QUESTIONS}
      >
        {addQuestions => {
          return (
            <Formik
              initialValues={{ questionsText: "" }}
              validateOnBlur={false}
              validate={values => {
                const errors = {};
                return errors;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const { questionsText } = values;

                const questions = getFormattedQuestions(questionsText);
                const variables: AddQuestionsMutationVariables = { questions };
                await addQuestions({ variables });

                setSubmitting(false);
                resetForm({ questionsText: "" });
              }}
            >
              {({
                touched,
                values,
                errors,
                handleChange,
                submitForm,
                isSubmitting
              }) => (
                <Form style={{ width: "100%", textAlign: "center" }}>
                  <div style={{ color: "white" }}>
                    Enter the questions string below:{" "}
                  </div>
                  <TextArea
                    name="questionsText"
                    onChange={handleChange}
                    value={values.questionsText || ""}
                    disabled={isSubmitting}
                    onKeyPress={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isSubmitting) submitForm();
                      }
                    }}
                    placeholder="Enter the questions string here"
                  />
                  <div style={{ color: "white" }}>
                    Please follow the format below:{" "}
                  </div>
                  {/* If you open console you will see the following error:

                    "Warning: Use the `defaultValue` or `value` props 
                    instead of setting children on <textarea>."

                    It's left on purpose, because value or defaultValue
                    add unwanted spacing to the string.
                  */}
                  <TextArea readOnly>
                    What did his mother say?;TAGS(mother); Dumbest thing a woman
                    could say?;TAGS(female,dumb); Finish the sentence: “He lacks
                    self-discipline but likes big butts
                    because...”;TAGS(discipline,ass); Finish the sentence: “She
                    wasn’t very pretty but...”;TAGS(female,ugly);
                  </TextArea>
                  <TextBtn
                    onClick={submitForm}
                    color="white"
                    backgroundColor="black"
                  >
                    Add
                  </TextBtn>
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
