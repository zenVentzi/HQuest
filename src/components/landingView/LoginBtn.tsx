import React from "react";
import { Facebook as FacebookLogo } from "styled-icons/fa-brands/Facebook";
//@ts-ignore
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { LOGIN_MUTATION } from "GqlClient/user/mutations";
import { Mutation, MutationFunc, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";
import styled from "styled-components";
import { saveLoggedUserData } from "Utils";
import { LoginMutation, LoginVariables } from "GqlClient/autoGenTypes";

interface LoginBtnProps {
  onLoggedIn: () => any;
  testUser?: LoginVariables;
}

const LoginBtn = ({ onLoggedIn, testUser }: LoginBtnProps) => {
  const responseFacebook = (
    mutation: MutationFn<LoginMutation, LoginVariables>
  ) => async (response: any) => {
    if (response.email) {
      const variables = {
        email: response.email,
        name: response.name
      };
      const result = await mutation({ variables });
      if (!result) {
        throw Error("Mutation result fail");
      }
      const { authToken, userId } = result.data.login;
      saveLoggedUserData(userId, authToken);
      onLoggedIn();
    }
  };

  const testLogin = (
    mutation: MutationFn<LoginMutation, LoginVariables>
  ) => async () => {
    const variables = {
      email: testUser.email,
      name: testUser.name
    };

    const result = await mutation({ variables });
    if (!result) {
      throw Error("Mutation result fail");
    }
    const { authToken, userId } = result.data.login;
    saveLoggedUserData(userId, authToken);
    onLoggedIn();
  };

  return (
    <Mutation<LoginMutation, LoginVariables> mutation={LOGIN_MUTATION}>
      {login =>
        testUser ? (
          <TextBtn onClick={testLogin(login)}>{testUser.name}</TextBtn>
        ) : (
          <FacebookLogin
            appId="765926203800350"
            fields="name,email,picture"
            callback={responseFacebook(login)}
            render={(renderProps: any) => (
              // @ts-ignore
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
