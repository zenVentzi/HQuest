import React from "react";
import styled from "styled-components";
import StyledIcon from "Reusable/StyledIcon";
import UndecoratedLink from "Reusable/UndecoratedLink";
import { clickableIcon } from "Reusable/css";
import { Link } from "react-router-dom";
import { History } from "history";

const StyledLink = styled(UndecoratedLink)`
  ${clickableIcon};
`;

interface IconLinkProps {
  icon: any;
  size: string;
  visible?: boolean;
  to: History.LocationDescriptor;
}

// TODO remove ref if not needed

const IconLink = React.forwardRef<Link, IconLinkProps>(
  ({ icon, size, visible = true, to }, ref) => {
    return (
      /* the visible hack(1 : 0) reason - 
    https://github.com/styled-components/styled-components/issues/1198 */
      <StyledLink to={to} visible={visible ? 1 : 0} ref={ref} role="button">
        <StyledIcon icon={icon} size={size} visible={visible} />
      </StyledLink>
    );
  }
);

export default IconLink;
