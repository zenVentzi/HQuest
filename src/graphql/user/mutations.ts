import gql from "graphql-tag";
import {
  QuestionFields,
  CommentFields,
  AnswerFields
} from "GqlClient/fragments";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $name: String!) {
    login(email: $email, name: $name) {
      authToken
      userId
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($input: EditUserInput) {
    editUser(input: $input) {
      id
    }
  }
`;
