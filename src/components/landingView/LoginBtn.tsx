import React from "react";
import { Facebook as FacebookLogo } from "styled-icons/fa-brands/Facebook";
//@ts-ignore
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { LOGIN_MUTATION } from "GqlClient/user/mutations";
import { Mutation, MutationFunc, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";
// import styled from "styled-components";
import { saveLoggedUserData } from "Utils";
import { LoginMutation, LoginMutationVariables } from "GqlClient/autoGenTypes";
import {
  ReactFacebookLoginInfo,
  ReactFacebookLoginProps
} from "react-facebook-login";

interface LoginBtnProps {
  onLoggedIn: () => void;
  testUser?: LoginMutationVariables;
}

const LoginBtn = ({ onLoggedIn, testUser }: LoginBtnProps) => {
  const responseFacebook = (
    mutation: MutationFn<LoginMutation, LoginMutationVariables>
  ) => async (response: ReactFacebookLoginInfo) => {
    if (response.email) {
      const variables: LoginMutationVariables = {
        email: response.email,
        name: response.name!
      };
      const result = await mutation({ variables });
      if (!result || !result.data) {
        throw Error("Mutation result fail");
      }
      const { authToken, user } = result.data.login;
      saveLoggedUserData(user, authToken);
      onLoggedIn();
    }
  };

  const testLogin = (
    mutation: MutationFn<LoginMutation, LoginMutationVariables>
  ) => async () => {
    const variables = {
      email: testUser!.email,
      name: testUser!.name
    };

    const result = await mutation({ variables });
    if (!result) {
      throw Error("Mutation result fail");
    }
    const { authToken, user } = result.data!.login;
    saveLoggedUserData(user, authToken);
    onLoggedIn();
  };

  return (
    <Mutation<LoginMutation, LoginMutationVariables> mutation={LOGIN_MUTATION}>
      {login =>
        testUser ? (
          <TextBtn onClick={testLogin(login)}>{testUser.name}</TextBtn>
        ) : (
          <FacebookLogin
            appId="765926203800350"
            fields="name,email,picture"
            callback={responseFacebook(login)}
            render={(renderProps: ReactFacebookLoginProps) => (
              <FacebookLogo
                size="2em"
                css="cursor: pointer"
                onClick={renderProps.onClick as any}
              />
            )}
          />
        )
      }
    </Mutation>
  );
};

export default LoginBtn;
