import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import rankings_white from "./rank_white.png";
import rankings_black from "./rank_black.png";
import styled from "styled-components";
// import { StyledIconProps } from "styled-icons/types";

const StyledImg = styled.img`
  cursor: pointer;
  vertical-align: middle;
  margin-left: 5px;
  width: 30px;
  height: 30px;
  &:active {
    border: 2px solid black;
  }
`;

interface RankingsBtnProps extends RouteComponentProps {}

const RankingsBtn = (props: RankingsBtnProps) => {
  const [imgSrc, setImgSrc] = useState(rankings_black);

  return (
    <StyledImg
      src={imgSrc}
      onMouseEnter={() => {
        setImgSrc(rankings_white);
      }}
      onMouseLeave={() => {
        setImgSrc(rankings_black);
      }}
      onClick={() => {
        const { history } = props;
        history.push("/rankings");
      }}
      style={{ cursor: "pointer", verticalAlign: "middle", marginLeft: "5px" }}
      // width="30"
      // height="30"
    />
  );

  {
    /* // return <img src={rankings} style={{ backgroundColor: "red" }} />; */
  }
};

/* am I going to change the color from the style
or only change images on hover? */

export default withRouter(RankingsBtn);
