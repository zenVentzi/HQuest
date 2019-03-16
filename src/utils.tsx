import { AUTH_TOKEN, USER_ID } from "./constants";
import arePropsEqual from "react-fast-compare";
import { Component, useRef, useEffect } from "react";
import React from "react";
import deep_diff from "deep-diff";

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

const getLoggedUserId = () => {
  const userId = localStorage.getItem(USER_ID);
  // console.log('TCL: getLoggedUserId -> userId', userId);
  return userId;
};

const overrideTheme = (neww: any) => (current: any) => {
  const res = { ...current, ...neww };
  return res;
};
class UserLoginEvent extends EventTarget {
  login(authToken: string, userId: string) {
    this.dispatchEvent(
      new CustomEvent("login", { detail: { authToken, userId } })
    );
  }

  onLogin(listener: (authToken: string, userId: string) => void) {
    this.addEventListener("login", (event: Event) => {
      const e = event as CustomEvent;
      listener(e.detail.authToken, e.detail.userId);
    });
  }
}

const loginEvent = new UserLoginEvent();

const saveLoggedUserData = (userId: string, authToken: string) => {
  localStorage.setItem(USER_ID, userId);
  localStorage.setItem(AUTH_TOKEN, authToken);
  loginEvent.login(authToken, userId);
};

const deleteLoggedUserData = () => {
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(AUTH_TOKEN);
};

const inverseColor = (color: string) => {
  return color === "white" ? "black" : "white";
};

const inverseTheme = (theme: any) => {
  const backgroundColor = inverseColor(theme.backgroundColor);
  const foregroundColor = inverseColor(theme.foregroundColor);
  return { ...theme, backgroundColor, foregroundColor };
};

const deepEqual = (prevProps: any, nextProps: any): boolean => {
  // the negation operator is because we use Ract.memo
  // and React.memo returns the opposite of shouldComponentUpdate
  return arePropsEqual(prevProps, nextProps);
};

/**
 * Logs what props changed from previous render
 */
const withPropsChecker = (WrappedComponent, componentName: string) => {
  return props => {
    const prevProps = useRef(props);
    useEffect(() => {
      const diff = deep_diff.diff(prevProps.current, props);
      if (diff) {
        console.log(`Component ${componentName} diff:`);
        console.log(diff);
      }
      prevProps.current = props;
    });
    return <WrappedComponent {...props} />;
  };
};

export {
  getAuthToken,
  getLoggedUserId,
  saveLoggedUserData,
  deleteLoggedUserData,
  loginEvent,
  overrideTheme,
  inverseColor,
  inverseTheme,
  deepEqual,
  withPropsChecker
};
