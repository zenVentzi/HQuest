import gql from "graphql-tag";
import { UserFields } from "GqlClient/fragments";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $name: String!) {
    login(email: $email, name: $name) {
      authToken
      user {
        ...UserFields
      }
    }
  }
  ${UserFields}
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput) {
    editUser(input: $input) {
      id
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;

export const FOLLOW = gql`
  mutation Follow($userId: ID!, $follow: Boolean!) {
    follow(userId: $userId, follow: $follow)
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($base64Img: String!) {
    uploadAvatar(base64Img: $base64Img)
  }
`;
