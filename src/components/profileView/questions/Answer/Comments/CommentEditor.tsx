import React, { useRef, useState } from "react";
import Textarea from "react-textarea-autosize";
import { Formik, Form, ErrorMessage } from "formik";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import MentionInput, { getMentionedUserIdsFromInput } from "./MentionInput";
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
  margin-top: 5px;
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 1em;
`;

const LeftBtn = styled(TextBtn)`
  margin-right: 1em;
  background: white;
  color: black;
  border: 2px solid black;
  cursor: pointer;

  &:hover {
    background: black;
    color: white;
  }
`;
const RightBtn = styled(TextBtn)`
  background: white;
  color: black;
  border: 2px solid black;
  cursor: pointer;

  &:hover {
    background: black;
    color: white;
  }
`;

interface CommentEditorProps {
  comment: string;
  onEdit: (
    newComment: string,
    mentionedUserIds: string[] | undefined | null
  ) => Promise<void>;
  onCancel: () => void;
  searchUsers: any;
}

/* this component is pretty much the same as AnswerEditor and CommentInput. DRY fix */

const CommentEditor = (props: CommentEditorProps) => {
  const [commentValue, setCommentValue] = useState<string>(props.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    const mentionedUserIds = getMentionedUserIdsFromInput(commentValue);
    setIsSubmitting(true);
    await props.onEdit(commentValue, mentionedUserIds);
    // setIsSubmitting(false); //not necessary since it gets unmounted
  };

  /* 1) pass forceSubmit property down to MentionInput
  2) Move the logic from onChange one layer up.
  3) Expose callbacks for onValueChange and onMentionsChange
    - this means I'll keep state in 2 places */

  return (
    <>
      <MentionInput
        width="100%"
        value={commentValue}
        onChange={e => {
          setCommentValue(e.target.value);
        }}
        onKeyDown={async e => {
          if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
            e.preventDefault();
            await onSubmit();
            // await onSubmitComment(commentAnswerEdition);
            // await onSubmit(e.target., mentionedUserIds.current);
          }
        }}
        placeholder="Add comment... use @userName to tag people"
        // initialValue={props.comment}
        searchUsers={props.searchUsers}
        // submitOnEnter={true}
        // shouldSubmit={shouldSubmit}
        disabled={isSubmitting}
        // onSubmit={props.onEdit}
      />
      <Buttons>
        <LeftBtn
          onClick={async () => {
            if (!isSubmitting) {
              await onSubmit();
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
