import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Formik, Form, ErrorMessage } from "formik";
import Textarea from "react-textarea-autosize";
import { toast } from "react-toastify";
import Comment, { CommentProps, CommentRef } from "./Comment";
import CommentsGql from "./CommentsGql";
import Panel from "../Panel";
import Floater from "react-floater";
import { MutationFn } from "react-apollo";
import {
  CommentFieldsFragment,
  CommentAnswerEditionMutation,
  CommentAnswerEditionVariables,
  EditCommentVariables,
  EditCommentMutation,
  RemoveCommentVariables,
  RemoveCommentMutation,
  AnswerFieldsComments,
  UsersVariables,
  UserFieldsFragment
} from "GqlClient/autoGenTypes";
import PeopleDropdown from "./UsersDropdown";
import TextareaAutosize from "react-textarea-autosize";
import UsersDropdown from "./UsersDropdown";
import { compose } from "async";

const StyledCommentInput = styled(Textarea)`
  /* margin-top: 2em; */
  width: 79%;
  min-height: min-content;
  background: white;
  color: black;
`;

const CommentInput = ({ innerRef = null, ...rest }: any) => {
  return <StyledCommentInput inputRef={innerRef} {...rest} />;
};

const ErrorText = styled.div`
  margin-top: 1em;
  color: red;
  margin-bottom: 1em;
`;

interface CommentsProps {
  comments: AnswerFieldsComments[] | null;
  answerId: string;
  answerEditionId: string;
  onAddComment: () => void;
  // onEditComment: () => void;
  onRemoveComment: () => void;
  scrollToComment?: string;
}

const Comments = (props: CommentsProps) => {
  const [comments, setComments] = useState(props.comments || []);
  const highlightedComment = useRef<HTMLDivElement>(null);
  const commentsPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedComment.current) {
      commentsPanel.current!.scrollTop = highlightedComment.current.offsetTop;
    }
  }, []);

  const updateComments = (
    newComment?: CommentFieldsFragment,
    removedComment?: CommentFieldsFragment,
    editedComment?: CommentFieldsFragment
  ) => {
    if (newComment) {
      setComments([...comments, newComment]);
    } else if (removedComment) {
      setComments(comments.filter(c => c.id !== removedComment.id));
    } else if (editedComment) {
      setComments(() => {
        const updatedComments = [...comments];
        for (let i = 0; i < updatedComments.length; i++) {
          if (updatedComments[i].id === editedComment.id) {
            updatedComments[i] = editedComment;
          }
        }

        return updatedComments;
      });
    }
  };

  const validateForm = (values: any) => {
    const errors: any = {};
    if (values.comment.length < 7) {
      errors.comment = "Comment must be at least 7 characters";
    }

    return errors;
  };

  const onSubmitForm = (
    commentAnswerMutation: MutationFn<
      CommentAnswerEditionMutation,
      CommentAnswerEditionVariables
    >
  ) => async (values: any, { setSubmitting, resetForm }: any) => {
    // console.log(commentAnswerMutation);
    const { answerId, onAddComment } = props;
    const variables: CommentAnswerEditionVariables = {
      answerId,
      answerEditionId: props.answerEditionId,
      comment: values.comment
    };
    const res = await commentAnswerMutation({ variables });
    if (!res || !res.data) {
      throw Error("Comment answer mutation failed");
    }

    const newComment = res.data.commentAnswerEdition;
    updateComments(newComment);
    toast.success("Comment added!");
    onAddComment();
    setSubmitting(false);
    resetForm({ comment: "" });
  };

  const onEditComment = (
    editCommentMutation: MutationFn<EditCommentMutation, EditCommentVariables>
  ) => async (commentId: string, commentValue: string) => {
    const { answerId } = props;
    const variables: EditCommentVariables = {
      answerId,
      answerEditionId: props.answerEditionId,
      commentId,
      commentValue
    };
    const res = await editCommentMutation({ variables });
    if (!res) {
      throw Error("Failed edit comment mutation");
    }

    const editedComment = res.data!.editComment;
    updateComments(undefined, undefined, editedComment);
    toast.success("Comment edited!");
  };

  const onRemoveComment = (
    removeCommentMutation: MutationFn<
      RemoveCommentMutation,
      RemoveCommentVariables
    >
  ) => async (commentId: string) => {
    const { answerId, onRemoveComment: onRemoveCommentProp } = props;
    const variables: RemoveCommentVariables = {
      answerId,
      answerEditionId: props.answerEditionId,
      commentId
    };
    const res = await removeCommentMutation({ variables });
    if (!res) {
      throw Error("removeCommentMutation failed");
    }

    const removedComment = res.data!.removeComment;
    updateComments(undefined, removedComment);
    onRemoveCommentProp();
    toast.success("Comment removed!");
  };

  const renderComments = (
    editCommentMutation: MutationFn<EditCommentMutation, EditCommentVariables>,
    removeCommentMutation: MutationFn<
      RemoveCommentMutation,
      RemoveCommentVariables
    >
  ) => {
    const { scrollToComment } = props;

    if (!comments || !comments.length) {
      return <div> Be the first to add a comment </div>;
    }

    const renderReversedComments = () => {
      const res: JSX.Element[] = [];
      const copy = comments.slice();

      while (copy.length) {
        const com = copy.pop();
        const commentProps = {
          key: com!.id,
          comment: com,
          onEdit: onEditComment(editCommentMutation),
          onRemove: onRemoveComment(removeCommentMutation)
        } as CommentProps & { key: string; ref: CommentRef };

        if (scrollToComment && scrollToComment === com!.id) {
          commentProps.ref = highlightedComment;
          // commentProps.ref = (ref: any) => {
          //   highlightedComment.current = ref;
          // };
        }

        res.push(<Comment {...commentProps} />);
      }
      return res;
    };

    return renderReversedComments();
  };

  const checkValidSearchChar = (key: string) => {
    // tslint:disable-next-line: variable-name
    const is_letter_number_hyphen_underscore = /[a-zA-Z0-9-_ ]/.test(key);
    return is_letter_number_hyphen_underscore;
  };

  const isSearchMode = useRef(false);
  const searchUsername = useRef<string | null>();
  // const commentInput = useRef<HTMLTextAreaElement>();
  const [matchingUsers, setMatchingUsers] = useState<
    UserFieldsFragment[] | null
  >(null);

  const onKeyPress = (
    submitForm: () => void,
    isSubmitting: boolean,
    searchUsers: (
      variables: UsersVariables
    ) => Promise<UserFieldsFragment[] | null>
  ) => async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.persist();
    console.log(e.key);

    if (e.key === "@" && !isSearchMode.current) {
      isSearchMode.current = true;
      return;
    }

    if (isSearchMode.current && checkValidSearchChar(e.key)) {
      if (!searchUsername.current) {
        searchUsername.current = e.key;
      } else {
        searchUsername.current += e.key;
      }

      const matching = await searchUsers({ match: searchUsername.current });

      if (!matching) {
        setMatchingUsers(null);
        return;
      }
      setMatchingUsers(matching);
    } else if (isSearchMode.current) {
      isSearchMode.current = false;
      searchUsername.current = null;
    }

    if (e.key === "Enter" && !e.shiftKey && !isSearchMode.current) {
      e.preventDefault();
      if (!isSubmitting) submitForm();
    }
  };

  return (
    <CommentsGql>
      {(commentAnswer, editComment, removeComment, searchUsers) => {
        return (
          <Panel ref={commentsPanel}>
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
                  <StyledCommentInput
                    name="comment"
                    // styles={{ wrapper: { width: "100%" } }}
                    placeholder="Add a comment..., use @userName to tag people"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.comment || ""}
                    disabled={isSubmitting}
                    onKeyPress={onKeyPress(
                      submitForm,
                      isSubmitting,
                      searchUsers
                    )}
                  />
                  {matchingUsers && <UsersDropdown users={matchingUsers} />}
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
