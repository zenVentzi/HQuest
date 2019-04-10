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
  CommentAnswerEditionMutationVariables,
  EditCommentMutationVariables,
  EditCommentMutation,
  RemoveCommentMutationVariables,
  RemoveCommentMutation,
  Comment as CommentType,
  UserFieldsFragment,
  UsersQueryVariables
} from "GqlClient/autoGenTypes";
import MentionInput, { getMentionedUserIdsFromInput } from "./MentionInput";

// const StyledCommentInput = styled(Textarea)`
//   /* margin-top: 2em; */
//   width: 79%;
//   min-height: min-content;
//   background: white;
//   color: black;
// `;

// const CommentInput = ({ innerRef = null, ...rest }: any) => {
//   return <StyledCommentInput inputRef={innerRef} {...rest} />;
// };

interface CommentsProps {
  comments: CommentFieldsFragment[] | null;
  answerId: string;
  answerEditionId: string;
  onAddComment: () => void;
  // onEditComment: () => void;
  onRemoveComment: () => void;
  scrollToComment?: string;
}

const Comments = (props: CommentsProps) => {
  const [comments, setComments] = useState(props.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const highlightedComment = useRef<HTMLDivElement>(null);
  const commentsPanel = useRef<HTMLDivElement>(null);
  const [commentValue, setCommentValue] = useState<string>("");

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

  // const validateForm = (values: any) => {
  //   const errors: any = {};
  //   if (values.comment.length < 7) {
  //     errors.comment = "Comment must be at least 7 characters";
  //   }

  //   return errors;
  // };

  // const onSubmitForm = (
  //   commentAnswerMutation: MutationFn<
  //     CommentAnswerEditionMutation,
  //     CommentAnswerEditionVariables
  //   >
  // ) => async (values: any, { setSubmitting, resetForm }: any) => {
  //   // console.log(commentAnswerMutation);
  //   const { answerId, onAddComment } = props;
  //   const variables: CommentAnswerEditionVariables = {
  //     answerId,
  //     answerEditionId: props.answerEditionId,
  //     comment: values.comment
  //   };
  //   const res = await commentAnswerMutation({ variables });
  //   if (!res || !res.data) {
  //     throw Error("Comment answer mutation failed");
  //   }

  //   const newComment = res.data.commentAnswerEdition;
  //   updateComments(newComment);
  //   toast.success("Comment added!");
  //   onAddComment();
  //   setSubmitting(false);
  //   resetForm({ comment: "" });
  // };

  const onSubmitComment = async (
    commentEditionMutation: MutationFn<
      CommentAnswerEditionMutation,
      CommentAnswerEditionMutationVariables
    >
  ): Promise<void> => {
    // const commentValue = inputRef.current!.value;
    // if (!commentValue) {
    //   throw Error(`commentValue must not be null`);
    // }

    const mentionedUserIds = getMentionedUserIdsFromInput(commentValue);
    if (commentValue.length < 3) {
      toast.error("Comment must be at least 3 characters long");
      return;
    }
    setIsSubmitting(true);
    const { answerId, onAddComment } = props;
    const variables: CommentAnswerEditionMutationVariables = {
      answerId,
      answerEditionId: props.answerEditionId,
      comment: commentValue,
      mentionedUsers: mentionedUserIds
    };
    const res = await commentEditionMutation({ variables });
    if (!res || !res.data) {
      throw Error("Comment answer mutation failed");
    }

    const newComment = res.data.commentAnswerEdition;
    // updateComments(newComment);
    // TODO make sure the above is not neccessary
    toast.success("Comment added!");
    onAddComment();
    setIsSubmitting(false);
    // inputRef.current!.value = "";
    setCommentValue("");
    // inputRef.current!.blur();
    // resetForm({ comment: "" });
  };

  /*problem is that if I keep the value state inside MentionInput I have to
  either 
  1) send down shouldReset prop
  2) duplicate state in MentionInput parent
  3) keep state only in MentionInput parent
  
  why not 3)?
  
  I can't create shouldReset prop because there might be errors onSubmit
  If I still want to use shouldReset, the MentionInput should know if
  the submit was successful, which smells like an antipattern
  
  what are the cons if I keep the value state in parent component?
  
  shouldSubmit goes away*/

  const onEditComment = (
    editCommentMutation: MutationFn<
      EditCommentMutation,
      EditCommentMutationVariables
    >
  ) => async (
    commentId: string,
    commentValue: string,
    mentionedUserIds: string[] | undefined
  ): Promise<{ success: boolean }> => {
    if (commentValue.length < 3) {
      toast.error("Comment must be at least 3 characters long");
      return { success: false };
    }
    const { answerId } = props;
    const variables: EditCommentMutationVariables = {
      answerId,
      answerEditionId: props.answerEditionId,
      commentId,
      commentValue,
      mentionedUsers: mentionedUserIds
    };
    const res = await editCommentMutation({ variables });
    if (!res) {
      throw Error("Failed edit comment mutation");
    }

    const editedComment = res.data!.editComment;
    updateComments(undefined, undefined, editedComment);
    toast.success("Comment edited!");
    return { success: true };
  };

  const onRemoveComment = (
    removeCommentMutation: MutationFn<
      RemoveCommentMutation,
      RemoveCommentMutationVariables
    >
  ) => async (commentId: string) => {
    const { answerId, onRemoveComment: onRemoveCommentProp } = props;
    const variables: RemoveCommentMutationVariables = {
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
    editCommentMutation: MutationFn<
      EditCommentMutation,
      EditCommentMutationVariables
    >,
    removeCommentMutation: MutationFn<
      RemoveCommentMutation,
      RemoveCommentMutationVariables
    >,
    searchUsersQuery: (
      variables: UsersQueryVariables
    ) => Promise<UserFieldsFragment[] | null>
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
        if (!com) {
          throw Error(`comment must be truthy`);
        }
        const commentProps: CommentProps & { key: string; ref?: CommentRef } = {
          key: com.id,
          comment: com,
          onEdit: onEditComment(editCommentMutation),
          onRemove: onRemoveComment(removeCommentMutation),
          searchUsers: searchUsersQuery
        };

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

  // const checkValidSearchChar = (key: string) => {
  //   // tslint:disable-next-line: variable-name
  //   const is_letter_number_hyphen_underscore = /[a-zA-Z0-9-_ ]/.test(key);
  //   return is_letter_number_hyphen_underscore;
  // };

  // if (e.key === "Enter" && !e.shiftKey && !isSearchMode.current) {
  //   e.preventDefault();
  //   if (!isSubmitting) submitForm();
  // } // used to be onKeyPress

  return (
    <CommentsGql>
      {(commentAnswerEdition, editComment, removeComment, searchUsers) => {
        return (
          <Panel ref={commentsPanel}>
            <MentionInput
              value={commentValue}
              onChange={e => {
                setCommentValue(e.target.value);
              }}
              onKeyDown={async e => {
                if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
                  e.preventDefault();
                  await onSubmitComment(commentAnswerEdition);
                  // await onSubmit(e.target., mentionedUserIds.current);
                }
              }}
              placeholder="Add comment... use @userName to tag people"
              searchUsers={searchUsers}
              // initialValue=""
              // submitOnEnter={true}
              disabled={isSubmitting}
              // onSubmit={onSubmitComment(commentAnswerEdition)}
            />
            {renderComments(editComment, removeComment, searchUsers)}
          </Panel>
        );
      }}
    </CommentsGql>
  );
};

export default Comments;
