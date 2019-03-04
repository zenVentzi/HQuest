import gql from "graphql-tag";
import {
  QuestionFields,
  CommentFields,
  AnswerFields
} from "GqlClient/fragments";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $name: String!) {
    login(email: $email, name: $name) {
      authToken
      userId
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput) {
    editUser(input: $input) {
      id
    }
  }
`;

export const FOLLOW = gql`
  mutation Follow($userId: ID!, $follow: Boolean!) {
    follow(userId: $userId, follow: $follow)
  }
`;
