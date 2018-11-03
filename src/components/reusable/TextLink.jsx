import React from 'react';
import styled from 'styled-components';
import UndecoratedLink from 'Reusable/UndecoratedLink';
import { clickableText } from 'Reusable/css';

const StyledLink = styled(UndecoratedLink)`
  ${clickableText};
`;

// TODO remove ref if not needed

const TextLink = React.forwardRef(({ children, to, onClick }, ref) => {
  return (
    <StyledLink to={to} ref={ref} onClick={onClick}>
      {children}
    </StyledLink>
  );
});

export default TextLink;
