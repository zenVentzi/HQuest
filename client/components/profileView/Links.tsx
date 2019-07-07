import React from "react";
import styled from "styled-components";
import * as types from "styled-components/cssprop";
import { Facebook as FacebookLogo } from "styled-icons/fa-brands/Facebook";
import { TwitterSquare as TwitterLogo } from "styled-icons/fa-brands/TwitterSquare";
import { Instagram as InstagramLogo } from "styled-icons/feather/Instagram";
import { Linkedin as LinkedInLogo } from "styled-icons/fa-brands/Linkedin";
import { UserFieldsFragment } from "GqlClient/autoGenTypes";
import IconLink from "../reusable/IconLink";

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
        <IconLink
          color="white"
          backgroundColor="black"
          icon={FacebookLogo}
          size="2em"
          to={facebookLink}
        />
      )}
      {twitterLink && twitterLink.length && (
        <IconLink
          color="white"
          backgroundColor="black"
          icon={TwitterLogo}
          size="2em"
          to={twitterLink}
        />
      )}
      {instagramLink && instagramLink.length && (
        <IconLink
          color="white"
          backgroundColor="black"
          icon={InstagramLogo}
          size="2em"
          to={instagramLink}
        />
      )}
      {linkedInLink && linkedInLink.length && (
        <IconLink
          color="white"
          backgroundColor="black"
          icon={LinkedInLogo}
          size="2em"
          to={linkedInLink}
        />
      )}
    </StyledLinks>
  );
};

export default Links;
