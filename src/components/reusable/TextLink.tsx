import React, { ReactChild } from "react";
import styled from "styled-components";
import UndecoratedLink from "Reusable/UndecoratedLink";
import { clickableText, ClickableTextProps } from "Reusable/css";
import { History } from "history";
import { Link, LinkProps } from "react-router-dom";

// const StyledLink = styled(UndecoratedLink)`
//   ${clickableText};
// `;

const StyledLink = styled(
  ({
    color,
    backgroundColor,
    ...rest
  }: ClickableTextProps & LinkProps & { ref: React.Ref<Link> }) => (
    <UndecoratedLink {...rest} />
  )
)`
  ${clickableText}
`;

interface TextLinkProps {
  children: ReactChild;
  to: History.LocationDescriptor;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

// TODO remove ref if not needed

const TextLink = React.forwardRef<Link, TextLinkProps>(
  ({ children, to, onClick }, ref) => {
    return (
      <StyledLink
        to={to}
        ref={ref}
        onClick={onClick}
        color="white"
        backgroundColor="black"
      >
        {children}
      </StyledLink>
    );
  }
);

export default TextLink;
