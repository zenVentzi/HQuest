import React, { useState } from "react";
// import style from "./bla.css";
import Select, { components } from "react-select";
// import { GlobalStyle } from "./appTheme";
import styledNormalize from "styled-normalize";
import styled, { createGlobalStyle } from "styled-components";
import NewsfeedBtn from "./navigation/NewsfeedBtn";
import RankingsBtn from "./navigation/RankingsBtn";
import { BrowserRouter } from "react-router-dom";
import UndecoratedLink from "Reusable/UndecoratedLink";
import { ClickableIconProps, clickableIcon } from "Reusable/css";
import { LocationDescriptor } from "history";
import { isUrlAbsolute } from "Utils";
import { Home } from "styled-icons/material/Home";
import StyledIcon from "Reusable/StyledIcon";
import rankings_black from "./navigation/rank_black.png";

type Option = { value: string; label: string };

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  * {
    box-sizing: border-box;
    color: white;
  }
`;

const TestApp = props => {
  return (
    <div>
      <img src={rankings_black} width="30" height="30" />
      <Home size="30px" style={{ verticalAlign: "baseline" }} />
    </div>
  );
};

export default TestApp;
