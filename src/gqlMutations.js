import gql from 'graphql-tag';

export const NOTIFS_MARK_SEEN = gql`
  mutation notifsMarkSeen {
    notifsMarkSeen
  }
`;

export const EDIT_USER = gql`
  mutation editUser($input: EditUserInput) {
    editUser(input: $input) {
      id
    }
  }
`;
