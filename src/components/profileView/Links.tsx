import React from "react";
import styled from "styled-components";
import * as types from "styled-components/cssprop";
import { Facebook as FacebookLogo } from "styled-icons/fa-brands/Facebook";
import { TwitterSquare as TwitterLogo } from "styled-icons/fa-brands/TwitterSquare";
import { Instagram as InstagramLogo } from "styled-icons/feather/Instagram";
import { Linkedin as LinkedInLogo } from "styled-icons/fa-brands/Linkedin";
import { UserFieldsFragment } from "GqlClient/autoGenTypes";

// export default () => <FacebookLogo />;

const StyledLinks = styled.div`
  display: flex;
  margin-bottom: 0.4em;
`;

type LinksProps = {
  links: UserFieldsFragment["socialMediaLinks"];
};

const Links = ({ links }: LinksProps) => {
  if (!links) return null;
  const { facebookLink, instagramLink, linkedInLink, twitterLink } = links;

  return (
    <StyledLinks>
      {facebookLink && facebookLink.length && (
        <FacebookLogo
          size="2em"
          css="cursor: pointer"
          onClick={() => console.log("click")}
        />
      )}
      {twitterLink && twitterLink.length && (
        <TwitterLogo
          size="2em"
          css="cursor: pointer"
          onClick={() => console.log("click")}
        />
      )}
      {instagramLink && instagramLink.length && (
        <InstagramLogo
          size="2em"
          css="cursor: pointer"
          onClick={() => console.log("click")}
        />
      )}
      {linkedInLink && linkedInLink.length && (
        <LinkedInLogo
          size="2em"
          css="cursor: pointer"
          onClick={() => console.log("click")}
        />
      )}
    </StyledLinks>
  );
};

export default Links;
