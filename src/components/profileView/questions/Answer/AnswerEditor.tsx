import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Textarea from "react-textarea-autosize";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import { QuestionFieldsAnswer } from "GqlClient/autoGenTypes";

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

interface AnswerEditorProps {
  onClickDoesNotApply: () => void;
  onClickSave: (answerValue: string) => void;
  answer: QuestionFieldsAnswer | null;
}

const AnswerEditor = (props: AnswerEditorProps) => {
  const checkLastCharsEqual = (
    text: string,
    last: number,
    equalChar: string
  ) => {
    if (text.length < last) {
      return false;
    }

    const lastChars = text.slice(-last).split("");
    return lastChars.filter(ch => ch === equalChar).length === last;
  };

  const minimizeNewlines = (newValue: string, oldValue: string) => {
    if (checkLastCharsEqual(newValue, 3, "\n")) {
      return oldValue;
    }

    return newValue;
  };

  const isNew = !props.answer;
  const initialValues = { answer: "" };
  if (!isNew) {
    const latestEdition = props.answer!.editions[
      props.answer!.editions.length - 1
    ];
    initialValues.answer = latestEdition.value;
  }

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur={false}
      validate={values => {
        const errors: any = {};
        if (values.answer.length < 10) {
          errors.answer = "Answer must be at least 10 characters";
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const answerValue = values.answer.trim();
        await props.onClickSave(answerValue);
        // resetForm(initialValues);
        // setSubmitting(false);
      }}
    >
      {({ values, handleChange, submitForm, isSubmitting }) => (
        <Form style={{ width: "100%", textAlign: "center" }}>
          <TextArea
            name="answer"
            placeholder="Answer..."
            onChange={e => {
              e.target.value = minimizeNewlines(e.target.value, values.answer);
              handleChange(e);
            }}
            value={values.answer || ""}
            disabled={isSubmitting}
          />
          <ErrorMessage
            name="answer"
            render={msg => <ErrorText>{msg}</ErrorText>}
          />
          <Buttons>
            <LeftBtn onClick={submitForm}>Save</LeftBtn>
            {isNew && (
              <RightBtn onClick={props.onClickDoesNotApply}>
                Does not apply
              </RightBtn>
            )}
          </Buttons>
        </Form>
      )}
    </Formik>
  );
};

export default AnswerEditor;
