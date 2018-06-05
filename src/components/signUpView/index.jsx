import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import StyledView from '../.reusable/StyledView';
import TextInput from '../.reusable/TextInput';

const SIGNUP_MUTATION = gql`
  mutation SignUpMutation(
    $firstName: String!,
    $surName: String!,
    $email: String!,
    $password: String!) {
      signUp(
        firstName: $firstName,
        surName: $surName,
        email: $email,
        password: $password)
  }
`;

const SignUpView = () => {
  let firstName;
  let surName;
  let email;
  let password;

  return (
    <StyledView>
      <Mutation
        mutation={SIGNUP_MUTATION}
      >
        {(signUp, { data }) => (
          <div>
            <TextInput placeholder="First name.." onChange={(e) => { firstName = e.target.value; }} />
            <TextInput placeholder="Surname.." onChange={(e) => { surName = e.target.value; }} />
            <TextInput placeholder="Email.." type="email" onChange={(e) => { email = e.target.value; }} />
            <TextInput placeholder="Password.." type="password" onChange={(e) => { password = e.target.value; }} />
            <br />
            <button onClick={() => {
              const variables = {
                firstName,
                surName,
                email,
                password,
              };

              signUp({ variables });
            }}
            >
             Sign up
            </button>
          </div>
        )}
      </Mutation>
    </StyledView>
  );
};

export default SignUpView;
