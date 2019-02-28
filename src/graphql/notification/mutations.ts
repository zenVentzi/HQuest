import gql from "graphql-tag";
import { QuestionFields, CommentFields, AnswerFields } from "graphql/fragments";

export const NOTIFS_MARK_SEEN = gql`
  mutation notifsMarkSeen {
    notifsMarkSeen
  }
`;
