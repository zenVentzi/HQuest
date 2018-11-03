import React from 'react';
import styled from 'styled-components';
import StyledIcon from 'Reusable/StyledIcon';
import UndecoratedLink from 'Reusable/UndecoratedLink';
import { clickableIcon } from 'Reusable/css';

const StyledLink = styled(UndecoratedLink)`
  ${clickableIcon};
`;

// TODO remove ref if not needed

const IconLink = React.forwardRef(({ icon, size, hide, to }, ref) => {
  return (
    <StyledLink to={to} ref={ref}>
      <StyledIcon icon={icon} size={size} hide={hide} />
    </StyledLink>
  );
});

export default IconLink;
