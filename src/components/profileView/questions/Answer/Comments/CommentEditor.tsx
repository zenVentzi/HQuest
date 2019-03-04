import React from "react";
import Textarea from "react-textarea-autosize";
import { Formik, Form, ErrorMessage } from "formik";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const StyledEditor = styled(Textarea)`
  /* min-height: min-content; */
  width: 100%;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 1em;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 1em;
`;

const LeftBtn = styled(TextBtn)`
  margin-right: 1em;
`;
const RightBtn = styled(TextBtn)``;

interface CommentEditorProps {
  comment: any;
  onEdit: (newComment: string) => Promise<void>;
  onCancel: () => void;
}

/* this component is pretty much the same as AnswerEditor and CommentInput. DRY fix */

const CommentEditor = (props: CommentEditorProps) => {
  const formInitialValues = { comment: props.comment };

  return (
    <Formik
      initialValues={formInitialValues}
      validateOnBlur={false}
      validate={values => {
        const errors: any = {};
        if (values.comment.length < 7)
          errors.comment = "Comment must be at least 7 characters";

        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await props.onEdit(values.comment);
        // setSubmitting(false);
        // resetForm(formInitialValues);
      }}
    >
      {({ values, handleChange, submitForm, handleBlur, isSubmitting }) => (
        <Form style={{ width: "100%", textAlign: "center" }}>
          <StyledEditor
            name="comment"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.comment}
            disabled={isSubmitting}
            onKeyPress={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isSubmitting) submitForm();
              }
            }}
          />
          <ErrorMessage
            name="comment"
            render={msg => <ErrorText>{msg}</ErrorText>}
          />
          <Buttons>
            <LeftBtn onClick={submitForm}>Save</LeftBtn>
            <RightBtn onClick={props.onCancel}>Cancel</RightBtn>
          </Buttons>
        </Form>
      )}
    </Formik>
  );
};

export default CommentEditor;
