import React from "react";

import styled from "styled-components";
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
      //@ts-ignore
      <FacebookLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
      //@ts-ignore
      <TwitterLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
      //@ts-ignore
      <InstagramLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
      //@ts-ignore
      <LinkedInLogo
        size="2em"
        css="cursor: pointer"
        onClick={() => console.log("click")}
      />
    </StyledLinks>
  );
};

export default Links;
