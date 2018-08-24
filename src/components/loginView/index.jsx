import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import StyledView from '../reusable/StyledView';
import TextInput from '../reusable/TextInput';
import { AUTH_TOKEN, USER_ID } from '../../constants';
import { history } from '../../utils';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      authToken
      userId
    }
  }
`;

const LoginView = props => {
  let email;
  let password;

  const onClickLogin = mutation => async () => {
    const variables = {
      email,
      password,
    };
    const result = await mutation({ variables });
    debugger;
    const { authToken, userId } = result.data.login;
    localStorage.setItem(AUTH_TOKEN, authToken);
    localStorage.setItem(USER_ID, userId);
    history.push('/');
  };

  return (
    <StyledView>
      <Mutation mutation={LOGIN_MUTATION}>
        {login => (
          <div>
            <TextInput
              placeholder="Email.."
              type="email"
              onChange={e => {
                email = e.target.value;
              }}
            />
            <TextInput
              placeholder="Password.."
              type="password"
              onChange={e => {
                password = e.target.value;
              }}
            />
            <button onClick={onClickLogin(login)}>Login</button>
          </div>
        )}
      </Mutation>
    </StyledView>
  );
};

export default LoginView;
