import gql from "graphql-tag";

export const UserFields = gql`
  fragment UserFields on User {
    id
    fullName
    avatarSrc
    intro
    socialMediaLinks {
      facebookLink
      twitterLink
      instagramLink
      linkedInLink
    }
    me
    followers
    following
    experience
  }
`;

export const LikerFields = gql`
  fragment LikerFields on Liker {
    user {
      ...UserFields
    }
    numOfLikes
  }
  ${UserFields}
`;

export const LikesFields = gql`
  fragment LikesFields on Likes {
    total
    likers {
      ...LikerFields
    }
  }
  ${LikerFields}
`;

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    user {
      ...UserFields
    }
    value
    likes {
      ...LikesFields
    }
  }
  ${UserFields}
  ${LikesFields}
`;

export const EditionFields = gql`
  fragment EditionFields on AnswerEdition {
    id
    date
    value
    comments {
      ...CommentFields
    }
    likes {
      ...LikesFields
    }
  }
  ${UserFields}
  ${CommentFields}
  ${LikesFields}
`;

export const AnswerFields = gql`
  fragment AnswerFields on Answer {
    id
    position
    userId
    questionId
    editions {
      ...EditionFields
    }
  }
  ${EditionFields}
`;

export const AnsweredQuestionFields = gql`
  fragment AnsweredQuestionFields on AnsweredQuestion {
    id
    value
    tags
    answer {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;
export const AnsweredQuestionFieldsFragmentName = `AnsweredQuestionFields`;

export const UnansweredQuestionFields = gql`
  fragment UnansweredQuestionFields on UnansweredQuestion {
    id
    value
    tags
  }
`;

export const UnansweredQuestionFieldsFragmentName = `UnansweredQuestionFields`;

export const PageInfoFields = gql`
  fragment PageInfoFields on PageInfo {
    startCursor
    endCursor
    hasNextPage
    hasPreviousPage
  }
`;

export const AnsweredQuestionEdgeFields = gql`
  fragment AnsweredQuestionEdgeFields on Edge {
    cursor
    node {
      ...AnsweredQuestionFields
    }
  }
  ${AnsweredQuestionFields}
`;

export const UnansweredQuestionEdgeFields = gql`
  fragment UnansweredQuestionEdgeFields on Edge {
    cursor
    node {
      ...UnansweredQuestionFields
    }
  }
  ${UnansweredQuestionFields}
`;

export const AnsweredQuestionConnectionFields = gql`
  fragment AnsweredQuestionConnectionFields on AnsweredQuestionConnection {
    pageInfo {
      ...PageInfoFields
    }
    edges {
      ...AnsweredQuestionEdgeFields
    }
    totalCount
  }
  ${PageInfoFields}
  ${AnsweredQuestionEdgeFields}
`;

export const UnansweredQuestionConnectionFields = gql`
  fragment UnansweredQuestionConnectionFields on UnansweredQuestionConnection {
    pageInfo {
      ...PageInfoFields
    }
    edges {
      ...UnansweredQuestionEdgeFields
    }
    totalCount
  }
  ${PageInfoFields}
  ${UnansweredQuestionEdgeFields}
`;

export const NotificationFields = gql`
  fragment NotificationFields on Notification {
    id
    type
    performerId
    performerAvatarSrc
    text
    seen
    createdOn
    ... on NewComment {
      userProfileId
      questionId
      editionId
      commentId
    }

    ... on AnswerEditionMention {
      userProfileId
      questionId
      editionId
    }
  }
`;
