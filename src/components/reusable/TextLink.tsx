import React from "react";
import styled from "styled-components";
import UndecoratedLink from "Reusable/UndecoratedLink";
import { clickableText } from "Reusable/css";
import { History } from "history";
import { Link } from "react-router-dom";

const StyledLink = styled(UndecoratedLink)`
  ${clickableText};
`;

interface TextLinkProps {
  children: any;
  to: History.LocationDescriptor;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

// TODO remove ref if not needed

const TextLink = React.forwardRef<Link, TextLinkProps>(
  ({ children, to, onClick }, ref) => {
    return (
      <StyledLink to={to} ref={ref} onClick={onClick}>
        {children}
      </StyledLink>
    );
  }
);

export default TextLink;
