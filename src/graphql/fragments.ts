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
  }
`;

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    user {
      ...UserFields
    }
    value
  }
  ${UserFields}
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

export const QuestionFields = gql`
  fragment QuestionFields on Question {
    id
    value
    tags
    answer {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;

export const QuestionFieldsFragmentName = `QuestionFields`;

export const PageInfoFields = gql`
  fragment PageInfoFields on PageInfo {
    startCursor
    endCursor
    hasNextPage
    hasPreviousPage
  }
`;

export const QuestionEdgeFields = gql`
  fragment QuestionEdgeFields on Edge {
    cursor
    node {
      ...QuestionFields
    }
  }
  ${QuestionFields}
`;

export const QuestionConnectionFields = gql`
  fragment QuestionConnectionFields on QuestionConnection {
    pageInfo {
      ...PageInfoFields
    }
    edges {
      ...QuestionEdgeFields
    }
    totalCount
  }
  ${PageInfoFields}
  ${QuestionEdgeFields}
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
