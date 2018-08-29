import React from 'react';

import styled from 'styled-components';
import { Facebook as FacebookLogo } from 'styled-icons/fa-brands/Facebook';
import { TwitterSquare as TwitterLogo } from 'styled-icons/fa-brands/TwitterSquare';
import { Instagram as InstagramLogo } from 'styled-icons/feather/Instagram';
import { Linkedin as LinkedInLogo } from 'styled-icons/fa-brands/Linkedin';

// export default () => <FacebookLogo />;

const StyledLinks = styled.div`
  display: flex;
  margin-bottom: 0.4em;
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
