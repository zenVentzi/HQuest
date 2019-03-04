import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Formik, Form, ErrorMessage } from "formik";
import Textarea from "react-textarea-autosize";
import { toast } from "react-toastify";
import Comment, { CommentProps, CommentRef } from "./Comment";
import CommentsGql from "./CommentsGql";
import Panel from "../Panel";
import { MutationFn } from "react-apollo";

const CommentInput = styled(Textarea)`
  /* margin-top: 2em; */
  width: 79%;
  min-height: min-content;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 1em;
`;

interface CommentsProps {
  comments: any[];
  answerId: string;
  onAddComment: () => void;
  // onEditComment: () => void;
  onRemoveComment: () => void;
  scrollToComment?: string;
}

const Comments = (props: CommentsProps) => {
  const [comments, setComments] = useState(props.comments || []);
  const highlightedComment = useRef(null);
  const panel = useRef<HTMLDivElement>();

  // TODO: IMPORTANT. This is commented out because of bad react typings
  // it should NOT be

  useEffect(() => {
    if (highlightedComment.current) {
      const a = highlightedComment.current.bla;
      // panel.current.scrollTop = highlightedComment.current.offsetTop;
    }
  }, []);

  const updateComments = (
    newComment?: any,
    removedComment?: any,
    editedComment?: any
  ) => {
    if (newComment) {
      setComments([...comments, newComment]);
    } else if (removedComment) {
      setComments(comments.filter(c => c.id !== removedComment.id));
    } else if (editedComment) {
      // @ts-ignore // ebaa sa s mene, ke go vidim posle
      setComments(() => {
        // const [...updatedComments] = comments;
        const updatedComments: any[] = [...comments];
        for (let i = 0; i < updatedComments.length; i++) {
          if (updatedComments[i].id === editedComment.id) {
            updatedComments[i] = editedComment;
          }
        }

        return updateComments;
      });
    }
  };

  const validateForm = (values: any) => {
    const errors: any = {};
    if (values.comment.length < 7)
      errors.comment = "Comment must be at least 7 characters";

    return errors;
  };

  const onSubmitForm = (commentAnswerMutation: MutationFn) => async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    // console.log(commentAnswerMutation);
    const { answerId, onAddComment } = props;
    const variables = {
      answerId,
      comment: values.comment
    };
    const res = await commentAnswerMutation({ variables });
    if (!res) {
      throw Error("Comment answer mutation failed");
    }
    const newComment = res.data.commentAnswer;
    updateComments(newComment);
    toast.success("Comment added!");
    onAddComment();
    setSubmitting(false);
    resetForm({ comment: "" });
  };

  const onEditComment = (editCommentMutation: MutationFn) => async (
    commentId: string,
    commentValue: string
  ) => {
    const { answerId } = props;
    const variables = { answerId, commentId, commentValue };
    const res = await editCommentMutation({ variables });
    if (!res) {
      throw Error("Failed edit comment mutation");
    }

    const editedComment = res.data.editComment;
    updateComments({ editedComment });
    toast.success("Comment edited!");
  };

  const onRemoveComment = (removeCommentMutation: MutationFn) => async (
    commentId: string
  ) => {
    const { answerId, onRemoveComment } = props;
    const variables = { answerId, commentId };
    const res = await removeCommentMutation({ variables });
    if (!res) {
      throw Error("removeCommentMutation failed");
    }

    const removedComment = res.data.removeComment;
    updateComments({ removedComment });
    onRemoveComment();
    toast.success("Comment removed!");
  };

  const renderComments = (
    editCommentMutation: MutationFn,
    removeCommentMutation: MutationFn
  ) => {
    const { scrollToComment } = props;

    if (!comments || !comments.length)
      return <div> Be the first to add a comment </div>;

    const renderReversedComments = () => {
      const res = [];
      const copy = comments.slice();

      while (copy.length) {
        const com = copy.pop();
        const commentProps = {
          key: com.id,
          comment: com,
          onEdit: onEditComment(editCommentMutation),
          onRemove: onRemoveComment(removeCommentMutation)
        } as CommentProps & { key: string; ref: CommentRef };

        if (scrollToComment && scrollToComment === com.id) {
          commentProps.ref = (ref: any) => {
            highlightedComment.current = ref;
          };
        }

        res.push(<Comment {...commentProps} />);
      }
      return res;
    };

    return renderReversedComments();
  };

  return (
    <CommentsGql>
      {(commentAnswer, editComment, removeComment) => {
        return (
          <Panel ref={panel}>
            <Formik
              initialValues={{ comment: "" }}
              validateOnBlur={false}
              validate={validateForm}
              onSubmit={onSubmitForm(commentAnswer)}
            >
              {({
                values,
                handleChange,
                submitForm,
                handleBlur,
                isSubmitting
              }) => (
                <Form style={{ width: "100%", textAlign: "center" }}>
                  <CommentInput
                    name="comment"
                    placeholder="Add a comment..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.comment || ""}
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
                </Form>
              )}
            </Formik>
            {renderComments(editComment, removeComment)}
          </Panel>
        );
      }}
    </CommentsGql>
  );
};

export default Comments;
