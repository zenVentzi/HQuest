import React from "react";
import { mentionRegex } from "./MentionConstants";
import { Link } from "react-router-dom";

interface CommentViewerProps {
  text: string;
  addLinkToMention?: boolean;
}

const TextWithMentions = ({
  text,
  addLinkToMention = true
}: CommentViewerProps) => {
  const splitComment = text.split(mentionRegex);
  const hasMentions = splitComment.length > 0;
  if (hasMentions) {
    return (
      <>
        {splitComment.map(part => {
          const isMention = part.search(mentionRegex) !== -1;
          if (!isMention) return part;
          const userIdRegex = part.match(/\(\w+\)/);
          const usernameRegex = part.match(/\[\w+( \w+)*\]/);
          if (!userIdRegex || !usernameRegex) {
            throw Error(`incorrect mention syntax`);
          }
          const userId = userIdRegex[0].slice(1, -1);
          const username = usernameRegex[0].slice(1, -1);
          const linkToUserProfile = `/userprofile/${userId}`;

          return addLinkToMention ? (
            <Link to={linkToUserProfile} key={userId}>
              {username}
            </Link>
          ) : (
            username
          );
        })}
      </>
    );
  }

  // using framgents because of typings problems:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>{text}</>;
};

export default TextWithMentions;
