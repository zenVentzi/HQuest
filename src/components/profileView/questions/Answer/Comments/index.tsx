import React, { useState, useRef, useEffect, useContext } from "react";
import deepClone from "clone";
import { ApolloConsumer } from "react-apollo";
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
  UsersQueryVariables,
  LikeCommentMutation,
  LikeCommentMutationVariables
} from "GqlClient/autoGenTypes";
import MentionInput, { getMentionedUserIdsFromInput } from "./MentionInput";
import { getLoggedUserId, getLoggedUser } from "Utils";
import ApolloClient from "apollo-client";
import { AnsweredQuestionContext } from "../../AnsweredQuestion";
import { EditionContext } from "../Edition";
import {
  QuestionFields,
  QuestionFieldsFragmentName
} from "GqlClient/fragments";

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

type CommentLikes = CommentFieldsFragment["likes"];

interface CommentsProps {
  comments: CommentFieldsFragment[] | null;
  // answerId: string;
  // answerEditionId: string;
  onAddComment?: () => void;
  // onEditComment: () => void;
  onRemoveComment?: () => void;
  scrollToComment?: string;
}

const Comments = (props: CommentsProps) => {
  // const [comments, setComments] = useState(props.comments || []);
  const apolloClient = useRef<ApolloClient<any>>();
  const debounceTimeoutIndex = useRef<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const highlightedComment = useRef<HTMLDivElement>(null);
  const commentsPanel = useRef<HTMLDivElement>(null);
  const [commentValue, setCommentValue] = useState<string>("");
  const answeredQuestion = useContext(AnsweredQuestionContext);
  const selectedEdition = useContext(EditionContext);

  if (!answeredQuestion) {
    throw Error(`asnwer cannot be null|undefined`);
  } else if (!selectedEdition) {
    throw Error(`edition cannot be null|undefined`);
  }

  useEffect(() => {
    if (highlightedComment.current) {
      commentsPanel.current!.scrollTop = highlightedComment.current.offsetTop;
    }
  }, []);

  // const updateComments = (
  //   newComment?: CommentFieldsFragment,
  //   removedComment?: CommentFieldsFragment,
  //   editedComment?: CommentFieldsFragment
  // ) => {
  //   if (newComment) {
  //     setComments([...comments, newComment]);
  //   } else if (removedComment) {
  //     setComments(comments.filter(c => c.id !== removedComment.id));
  //   } else if (editedComment) {
  //     setComments(() => {
  //       const updatedComments = [...comments];
  //       for (let i = 0; i < updatedComments.length; i++) {
  //         if (updatedComments[i].id === editedComment.id) {
  //           updatedComments[i] = editedComment;
  //         }
  //       }

  //       return updatedComments;
  //     });
  //   }
  // };

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

  const onAddNewComment = async (
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
    const variables: CommentAnswerEditionMutationVariables = {
      answerId: answeredQuestion.answer.id,
      answerEditionId: selectedEdition.id,
      comment: commentValue,
      mentionedUsers: mentionedUserIds
    };
    const res = await commentEditionMutation({ variables });
    if (!res || !res.data) {
      throw Error("Comment answer mutation failed");
    }

    // const newComment = res.data.commentAnswerEdition;
    // updateComments(newComment);
    // TODO make sure the above is not neccessary
    toast.success("Comment added!");
    if (props.onAddComment) {
      props.onAddComment();
    }
    setIsSubmitting(false);
    // inputRef.current!.value = "";
    setCommentValue("");
    // inputRef.current!.blur();
    // resetForm({ comment: "" });
  };

  const onLikeComment = (
    likeCommentMutation: MutationFn<
      LikeCommentMutation,
      LikeCommentMutationVariables
    >
  ) => async (commentId: string) => {
    const likedComment = props.comments!.find(c => c.id === commentId);
    if (!likedComment) {
      throw Error(`likedComment cannot be null|undefined`);
    }
    let userLikes = 0;
    let totalLikes = 0;
    if (likedComment.likes) {
      totalLikes = likedComment.likes.total;
      const userLikerObj = likedComment.likes.likers.find(
        liker => liker.user.id === getLoggedUserId()
      );
      userLikes = userLikerObj ? userLikerObj.numOfLikes : 0;
    }
    if (userLikes <= 20) {
      const questionWithUpdatedComments = deepClone(answeredQuestion);

      questionWithUpdatedComments.answer.editions.forEach(ed => {
        if (ed.id === selectedEdition.id) {
          if (!ed.comments) {
            throw Error(`comments cannot be null|undefined`);
          } else {
            const comment = ed.comments.find(com => com.id === commentId);
            if (!comment) {
              throw Error(`comment cannot be null|undefned`);
            }

            for (let i = 0; i < ed.comments.length; i++) {
              const com = ed.comments[i];

              if (com.id === commentId) {
                let commentLikes: CommentLikes = ed.comments[i].likes;
                const loggedUser = getLoggedUser();
                if (!loggedUser) {
                  throw Error(`logged user cannot be null|undefined`);
                }
                if (!commentLikes) {
                  commentLikes = {
                    total: userLikes + 1,
                    likers: [
                      {
                        numOfLikes: userLikes + 1,
                        user: loggedUser,
                        __typename: "Liker"
                      }
                    ],
                    __typename: "Likes"
                  };
                  // ed.comments[i].likes
                } else {
                  commentLikes.total += 1;
                  commentLikes.likers.forEach(liker => {
                    if (liker.user.id === loggedUser.id) {
                      liker.numOfLikes += 1;
                    }
                  });
                }
                ed.comments[i].likes = commentLikes;
                break;
              } else {
                const reachedLastComment = i === ed.comments.length - 1;
                if (reachedLastComment) {
                  throw Error(`Comment must exist but could not be found.`);
                }
              }
            }
          }
        }
      });

      if (!apolloClient.current) {
        throw Error(`apolloClient cannot be null|undefined`);
      }
      apolloClient.current.writeFragment({
        fragment: QuestionFields,
        data: questionWithUpdatedComments,
        id: `${questionWithUpdatedComments.__typename}:${
          questionWithUpdatedComments.id
        }`,
        fragmentName: QuestionFieldsFragmentName
      });

      /* user can click multiple times in a row, creating unnecessary sequential requests to the server */
      await debounce(500);
      const variables: LikeCommentMutationVariables = {
        answerId: answeredQuestion.answer.id,
        answerEditionId: selectedEdition.id,
        commentId: likedComment.id,
        userLikes: userLikes + 1
      };
      // await likeCommentMutation({ variables });
    } else {
      toast.error("Max 20 likes per edition");
      /* toast a message
      "don't suck your own dick 
      just because you can"
      if user likes their own comments */
    }
  };

  const debounce = async (milliseconds: number) => {
    const cancelPrev = () => {
      if (debounceTimeoutIndex.current) {
        clearTimeout(debounceTimeoutIndex.current);
        debounceTimeoutIndex.current = undefined;
      }
    };
    cancelPrev();
    return new Promise(resolve => {
      debounceTimeoutIndex.current = setTimeout(resolve, milliseconds);
    });
    // return new Promise(resolve => setTimeout(resolve, milliseconds));
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
    mentionedUserIds: string[] | null | undefined
  ): Promise<{ success: boolean }> => {
    if (commentValue.length < 3) {
      toast.error("Comment must be at least 3 characters long");
      return { success: false };
    }
    const variables: EditCommentMutationVariables = {
      answerId: answeredQuestion.answer.id,
      answerEditionId: selectedEdition.id,
      commentId,
      commentValue,
      mentionedUsers: mentionedUserIds
    };
    const res = await editCommentMutation({ variables });
    if (!res) {
      throw Error("Failed edit comment mutation");
    }

    const editedComment = res.data!.editComment;
    // updateComments(undefined, undefined, editedComment);
    toast.success("Comment edited!");
    return { success: true };
  };

  const onRemoveComment = (
    removeCommentMutation: MutationFn<
      RemoveCommentMutation,
      RemoveCommentMutationVariables
    >
  ) => async (commentId: string) => {
    const { onRemoveComment: onRemoveCommentProp } = props;
    const variables: RemoveCommentMutationVariables = {
      answerId: answeredQuestion.answer.id,
      answerEditionId: selectedEdition.id,
      commentId
    };
    const res = await removeCommentMutation({ variables });
    if (!res) {
      throw Error("removeCommentMutation failed");
    }

    // const removedComment = res.data!.removeComment;
    // updateComments(undefined, removedComment);
    if (onRemoveCommentProp) {
      onRemoveCommentProp();
    }
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
    likeCommentMutation: MutationFn<
      LikeCommentMutation,
      LikeCommentMutationVariables
    >,
    searchUsersQuery: (
      variables: UsersQueryVariables
    ) => Promise<UserFieldsFragment[] | null>
  ) => {
    const { scrollToComment } = props;

    if (!props.comments || !props.comments.length) {
      return <div> Be the first to add a comment </div>;
    }

    const renderReversedComments = () => {
      const res: JSX.Element[] = [];
      const copy = props.comments!.slice();

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
          onLike: onLikeComment(likeCommentMutation),
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
      {(
        commentAnswerEdition,
        editComment,
        removeComment,
        likeComment,
        searchUsers
      ) => {
        return (
          <ApolloConsumer>
            {client => {
              apolloClient.current = client;
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
                        await onAddNewComment(commentAnswerEdition);
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
                  {renderComments(
                    editComment,
                    removeComment,
                    likeComment,
                    searchUsers
                  )}
                </Panel>
              );
            }}
          </ApolloConsumer>
        );
        // return (
        //   <Panel ref={commentsPanel}>
        //     <MentionInput
        //       value={commentValue}
        //       onChange={e => {
        //         setCommentValue(e.target.value);
        //       }}
        //       onKeyDown={async e => {
        //         if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
        //           e.preventDefault();
        //           await onAddNewComment(commentAnswerEdition);
        //           // await onSubmit(e.target., mentionedUserIds.current);
        //         }
        //       }}
        //       placeholder="Add comment... use @userName to tag people"
        //       searchUsers={searchUsers}
        //       // initialValue=""
        //       // submitOnEnter={true}
        //       disabled={isSubmitting}
        //       // onSubmit={onSubmitComment(commentAnswerEdition)}
        //     />
        //     {renderComments(editComment, removeComment, searchUsers)}
        //   </Panel>
        // );
      }}
    </CommentsGql>
  );
};

export default Comments;
