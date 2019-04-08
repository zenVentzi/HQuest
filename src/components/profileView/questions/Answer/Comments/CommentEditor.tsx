import React, { useRef, useState } from "react";
import Textarea from "react-textarea-autosize";
import { Formik, Form, ErrorMessage } from "formik";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import MentionInput from "./MentionInput";
// import { EditionFieldsComments } from "GqlClient/autoGenTypes";

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
  comment: string;
  onEdit: (
    newComment: string,
    mentionedUserIds: string[] | undefined
  ) => Promise<{ success: boolean }>;
  onCancel: () => void;
  searchUsers: any;
}

/* this component is pretty much the same as AnswerEditor and CommentInput. DRY fix */

const CommentEditor = (props: CommentEditorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  /* 1) pass forceSubmit property down to MentionInput
  2) Move the logic from onChange one layer up.
  3) Expose callbacks for onValueChange and onMentionsChange
    - this means I'll keep state in 2 places */

  return (
    <>
      <MentionInput
        initialValue={props.comment}
        searchUsers={props.searchUsers}
        submitOnEnter={true}
        shouldSubmit={shouldSubmit}
        isSubmitting={isSubmitting}
        onSubmit={props.onEdit}
      />
      <Buttons>
        <LeftBtn
          onClick={() => {
            if (!isSubmitting) {
              setShouldSubmit(true);
            }
          }}
        >
          Save
        </LeftBtn>
        <RightBtn onClick={props.onCancel}>Cancel</RightBtn>
      </Buttons>
    </>
  );
};

export default CommentEditor;
