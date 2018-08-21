import React from 'react';
import {
  Facebook as FacebookLogo,
  Twitter as TwitterLogo,
  Instagram as InstagramLogo,
  Linkedin as LinkedInLogo,
} from 'styled-icons/fa-brands';
import styled from 'styled-components';

const StyledLinks = styled.div`
  display: flex;
  margin-bottom: 1em;
`;

const Links = () => {
  const test = 5;
  return (
    <StyledLinks>
      <FacebookLogo
        size="2em"
        css="cursor: pointer"
        onClick={e => console.log('click')}
      />
      <TwitterLogo
        size="2em"
        css="cursor: pointer"
        onClick={e => console.log('click')}
      />
      <InstagramLogo
        size="2em"
        css="cursor: pointer"
        onClick={e => console.log('click')}
      />
      <LinkedInLogo
        size="2em"
        css="cursor: pointer"
        onClick={e => console.log('click')}
      />
    </StyledLinks>
  );
};

export default Links;
