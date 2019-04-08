import React from "react";
import styled from "styled-components";
import TextWithMentions from "Reusable/TextWithMentions";

const StyledViewer = styled.p`
  word-break: break-all;
  white-space: normal;
  text-align: left;
`;

interface CommentViewerProps {
  comment: string;
}

const CommentViewer = (props: CommentViewerProps) => {
  const { comment } = props;
  return (
    <StyledViewer>
      - <TextWithMentions text={comment} />
    </StyledViewer>
  );
};

export default CommentViewer;
