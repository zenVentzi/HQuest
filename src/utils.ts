import { AUTH_TOKEN, USER_ID } from "./constants";

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

export {
  getAuthToken,
  getLoggedUserId,
  saveLoggedUserData,
  deleteLoggedUserData,
  loginEvent,
  overrideTheme,
  inverseColor,
  inverseTheme
};
