import React, { useState } from "react";
import rankings_white from "./rank_white.png";
import rankings_black from "./rank_black.png";
// import { StyledIconProps } from "styled-icons/types";

const RankingsBtn = props => {
  const [imgSrc, setImgSrc] = useState(rankings_black);

  return (
    <img
      src={imgSrc}
      onMouseEnter={() => {
        setImgSrc(rankings_white);
      }}
      onMouseLeave={() => {
        setImgSrc(rankings_black);
      }}
      style={{ cursor: "pointer", verticalAlign: "middle", marginLeft: "5px" }}
      width="30"
      height="30"
    />
  );

  {
    /* // return <img src={rankings} style={{ backgroundColor: "red" }} />; */
  }
};

/* am I going to change the color from the style
or only change images on hover? */

export default RankingsBtn;
