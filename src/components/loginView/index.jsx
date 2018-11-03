import React from 'react';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { LOGIN_MUTATION } from 'Mutations';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import StyledView from '../reusable/StyledView';
import { AUTH_TOKEN, USER_ID } from '../../constants';
import { history } from '../../utils';

const TextInput = styled.input`
  width: 10em;
`;

const LoginView = () => {
  const responseFacebook = mutation => async response => {
    if (response.email) {
      const variables = {
        email: response.email,
        name: response.name,
        userId: response.userID,
      };
      const result = await mutation({ variables });
      const { authToken, userId } = result.data.login;
      localStorage.setItem(AUTH_TOKEN, authToken);
      localStorage.setItem(USER_ID, userId);
      // history.push('/');
    }
  };

  return (
    <StyledView>
      <Mutation mutation={LOGIN_MUTATION}>
        {login => (
          <FacebookLogin
            appId="765926203800350"
            fields="name,email,picture"
            callback={responseFacebook(login)}
            render={renderProps => (
              <button onClick={renderProps.onClick}>FB login</button>
            )}
          />
        )}
      </Mutation>
    </StyledView>
  );
};

/* 

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

*/

export default LoginView;
