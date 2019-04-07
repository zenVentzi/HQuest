import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { mentionRegex } from "./MentionConstants";
import { Link } from "react-router-dom";

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
  const splitComment = comment.split(mentionRegex);
  const hasMentions = splitComment.length > 0;
  if (hasMentions) {
    return (
      <StyledViewer>
        -{" "}
        {splitComment.map(text => {
          const isMention = text.search(mentionRegex) !== -1;
          if (!isMention) return text;
          const userIdRegex = text.match(/\(\w+\)/);
          const usernameRegex = text.match(/\[\w+( \w+)*\]/);
          if (!userIdRegex || !usernameRegex) {
            throw Error(`incorrect mention syntax`);
          }
          const userId = userIdRegex[0].slice(1, -1);
          const username = usernameRegex[0].slice(1, -1);
          const linkToUserProfile = `/userprofile/${userId}`;

          console.log(username);

          return (
            <Link to={linkToUserProfile} key={userId}>
              {username}
            </Link>
          );
        })}
      </StyledViewer>
    );
  }

  return <StyledViewer>- {comment}</StyledViewer>;
};

export default CommentViewer;
