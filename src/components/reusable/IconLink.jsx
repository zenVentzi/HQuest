import React from 'react';
import styled from 'styled-components';
import StyledIcon from 'Reusable/StyledIcon';
import UndecoratedLink from 'Reusable/UndecoratedLink';
import { clickableIcon } from 'Reusable/css';

const StyledLink = styled(UndecoratedLink)`
  ${clickableIcon};
`;

// TODO remove ref if not needed

const IconLink = React.forwardRef(({ icon, size, visible = true, to }, ref) => {
  return (
    /* the visible hack reason - 
    https://github.com/styled-components/styled-components/issues/1198 */
    <StyledLink to={to} visible={visible ? 1 : 0} ref={ref} role="button">
      <StyledIcon icon={icon} size={size} visible={visible} />
    </StyledLink>
  );
});

export default IconLink;
