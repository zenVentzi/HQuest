import React, { useState } from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import CommentOptions from "./CommentOptions";
import CommentViewer from "./CommentViewer";
import CommentEditor from "./CommentEditor";
import { Comment } from "GqlClient/autoGenTypes";

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
  comment: Comment;
  onRemove: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, commentValue: string) => Promise<void>;
  size?: number;
}

export type CommentRef = React.Ref<HTMLDivElement>;

// export interface CommentProps extends CommentPropsPrivate {
//   ref: React.Ref<HTMLDivElement>;
// }

export default React.forwardRef<HTMLDivElement, CommentProps>(
  (
    { size = 1.5, comment, onRemove: onRemoveProp, onEdit: onEditProp },
    ref
  ) => {
    const [commentHovered, setCommentHovered] = useState(false);
    const [viewMode, setViewMode] = useState(true);
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

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

    const onClickEdit = () => {
      setViewMode(false);
    };

    const onCancelEdit = () => {
      setViewMode(true);
    };

    const onEdit = async (newComment: string) => {
      await onEditProp(comment.id, newComment);
      setViewMode(true);
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
            visible={!!user.me && commentHovered}
            onClickEdit={onClickEdit}
            onClickRemove={onRemove}
          />
        </Header>
        {viewMode ? (
          <CommentViewer comment={value} />
        ) : (
          <CommentEditor
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
