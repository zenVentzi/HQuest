import React from 'react';
// import FacebookLogin from 'react-facebook-login';
import { Facebook as FacebookLogo } from 'styled-icons/fa-brands/Facebook';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { LOGIN_MUTATION } from 'Mutations';
import { Mutation } from 'react-apollo';
import TextBtn from 'Reusable/TextBtn';
import styled from 'styled-components';
import { saveLoggedUserData } from 'Utils';

const LoginBtn = ({ onLoggedIn, testUser }) => {
  const responseFacebook = mutation => async response => {
    if (response.email) {
      const variables = {
        email: response.email,
        name: response.name,
      };
      const result = await mutation({ variables });
      const { authToken, userId } = result.data.login;
      saveLoggedUserData({ userId, authToken });
      onLoggedIn();
    }
  };

  const testLogin = mutation => async () => {
    const variables = {
      email: testUser.email,
      name: testUser.name,
    };

    const result = await mutation({ variables });
    const { authToken, userId } = result.data.login;
    saveLoggedUserData({ userId, authToken });
    onLoggedIn();
  };

  return (
    <Mutation mutation={LOGIN_MUTATION}>
      {login =>
        testUser ? (
          <TextBtn onClick={testLogin(login)}>{testUser.name}</TextBtn>
        ) : (
          <FacebookLogin
            appId="765926203800350"
            fields="name,email,picture"
            callback={responseFacebook(login)}
            render={renderProps => (
              <FacebookLogo
                size="2em"
                css="cursor: pointer"
                onClick={renderProps.onClick}
              />
            )}
          />
        )
      }
    </Mutation>
  );
};

export default LoginBtn;
