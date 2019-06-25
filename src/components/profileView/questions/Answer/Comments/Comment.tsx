import React, { useState, useRef } from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import CommentOptions from "./CommentOptions";
import CommentViewer from "./CommentViewer";
import CommentEditor from "./CommentEditor";
import {
  CommentFieldsFragment,
  LikeCommentMutationVariables
} from "GqlClient/autoGenTypes";
import { getLoggedUserId } from "Utils";

// const OptionsBtn = styled(CaretSquareDown).attrs({ size: '0.8em' })`
//   cursor: pointer;
//   margin-left: auto;
//   align-self: center;
// `;

const StyledComment = styled.div`
  width: 80%;
  margin-bottom: 0.8em;
`;

const Header = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-bottom: 0.5em;
`;

export interface CommentProps {
  comment: CommentFieldsFragment;
  onRemove: (commentId: string) => Promise<void>;
  onEdit: (
    commentId: string,
    commentValue: string,
    mentionedUserIds: string[] | null | undefined
  ) => Promise<{ success: boolean }>;
  onLike: (commentId: string) => Promise<void>;
  size?: number;
  searchUsers: any;
}

export type CommentRef = React.Ref<HTMLDivElement>;

// export interface CommentProps extends CommentPropsPrivate {
//   ref: React.Ref<HTMLDivElement>;
// }

export default React.forwardRef<HTMLDivElement, CommentProps>(
  (
    {
      size = 1.5,
      comment,
      onRemove: onRemoveProp,
      onEdit: onEditProp,
      onLike: onLikeProp,
      searchUsers
    },
    ref
  ) => {
    const [commentHovered, setCommentHovered] = useState(false);
    const [viewMode, setViewMode] = useState(true);
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const timeoutIndex = useRef<number>();
    const [totalLikes, setTotalLikes] = useState(() => {
      return comment.likes ? comment.likes.total : 0;
    });
    const [userLikes, setUserLikes] = useState(() => {
      if (!comment.likes) return 0;
      const usr = comment.likes.likers.find(
        liker => liker.user.id === getLoggedUserId()
      );

      return usr ? usr.numOfLikes : 0;
    });

    const onClickOutsideOptions = (e: MouseEvent) => {
      const isOptionsBtn = false;
      // const isOptionsBtn =
      //   e.target === optionsBtn || e.target === optionsBtn.children[0];
      if (isOptionsBtn) return;
      toggleOptionsDropdown();
    };

    const onMouseEnter = () => {
      setCommentHovered(true);
    };

    const onMouseLeave = () => {
      setCommentHovered(false);
    };

    const onRemove = async () => {
      await onRemoveProp(comment.id);
    };

    // const onClickLike = async () => {
    //   if (userLikes <= 20) {
    //     const newUserLikes = userLikes + 1;
    //     const newTotalLikes = totalLikes + 1;
    //     setUserLikes(newUserLikes);
    //     setTotalLikes(newTotalLikes);
    //     /* user can click multiple times in a row, creating too many sequential requests to the server */
    //     await debounce(500);
    //     const variables: LikeCommentMutationVariables = {
    //       answerId: props.answerId,
    //       answerEditionId: props.editionId,
    //       commentId: comment.id,
    //       userLikes: newUserLikes
    //     };
    //     await props.likeComment({ variables });
    //   } else {
    //     toast.error("Max 20 likes per edition");
    //     /* toast a message "don't suck your own dick
    //     just because you can" */
    //   }
    // };

    const debounce = async (milliseconds: number) => {
      const cancelPrev = () => {
        if (timeoutIndex.current) {
          clearTimeout(timeoutIndex.current);
          timeoutIndex.current = undefined;
        }
      };
      cancelPrev();
      return new Promise(resolve => {
        timeoutIndex.current = setTimeout(resolve, milliseconds);
      });
      // return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    const onClickEdit = () => {
      setViewMode(false);
    };

    const onCancelEdit = () => {
      setViewMode(true);
    };

    const onEdit = async (
      newComment: string,
      mentionedUserIds: string[] | null | undefined
    ): Promise<void> => {
      const { success } = await onEditProp(
        comment.id,
        newComment,
        mentionedUserIds
      );
      if (success) {
        setViewMode(true);
      }
    };

    const toggleOptionsDropdown = () => {
      setShowOptionsDropdown(!showOptionsDropdown);
    };

    const { user, value } = comment;

    return (
      <StyledComment
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={ref}
      >
        <Header>
          <User user={user} size={size} />
          <CommentOptions
            visible={!!user.me}
            onClickEdit={onClickEdit}
            onClickRemove={onRemove}
          />
        </Header>
        {viewMode ? (
          <CommentViewer
            comment={comment}
            likes={comment.likes}
            onClickLike={() => {
              onLikeProp(comment.id);
            }}
          />
        ) : (
          <CommentEditor
            searchUsers={searchUsers}
            comment={value}
            onEdit={onEdit}
            onCancel={onCancelEdit}
          />
        )}
      </StyledComment>
    );
  }
);

// export default React.forwardRef((props: any, ref) => (
//   <Comment innerRef={ref} {...props} />
// ));
