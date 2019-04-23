import React from "react";
import styled from "styled-components";
import * as types from "styled-components/cssprop";
import { Facebook as FacebookLogo } from "styled-icons/fa-brands/Facebook";
import { TwitterSquare as TwitterLogo } from "styled-icons/fa-brands/TwitterSquare";
import { Instagram as InstagramLogo } from "styled-icons/feather/Instagram";
import { Linkedin as LinkedInLogo } from "styled-icons/fa-brands/Linkedin";

// export default () => <FacebookLogo />;

const StyledLinks = styled.div`
  display: flex;
  margin-bottom: 0.4em;
`;

const Links = () => {
  return (
    <StyledLinks>
      <FacebookLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
      <TwitterLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
      <InstagramLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
      <LinkedInLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
    </StyledLinks>
  );
};

export default Links;
