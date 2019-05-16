import React from "react";
import styled from "styled-components";
import StyledIcon from "Reusable/StyledIcon";
import UndecoratedLink from "Reusable/UndecoratedLink";
import { clickableIcon, ClickableIconProps } from "Reusable/css";
import { Link } from "react-router-dom";
import { History, LocationDescriptor } from "history";

// added complexity due to https://github.com/styled-components/styled-components/issues/135
const StyledLink = styled(
  ({
    visible,
    color,
    backgroundColor,
    children,
    ...rest
  }: ClickableIconProps & {
    to: LocationDescriptor<any>;
    children: any;
    ref: any;
    role: string;
  }) => <UndecoratedLink {...rest}>{children}</UndecoratedLink>
)`
  ${clickableIcon};
`;

type IconLinkProps = ClickableIconProps & {
  icon: any;
  size: string;
  visible?: boolean;
  to: History.LocationDescriptor;
};

// TODO remove ref if not needed

const IconLink = React.forwardRef<Link, IconLinkProps>(
  ({ icon, size, visible = true, to, color, backgroundColor }, ref) => {
    return (
      /* the visible hack(1 : 0) reason - 
    https://github.com/styled-components/styled-components/issues/1198 */
      <StyledLink
        to={to}
        visible={visible ? 1 : 0}
        ref={ref}
        role="button"
        color={color}
        backgroundColor={backgroundColor}
      >
        <StyledIcon icon={icon} size={size} visible={visible} />
      </StyledLink>
    );
  }
);

export default IconLink;
