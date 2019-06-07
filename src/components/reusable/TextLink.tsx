import React, { ReactChild } from "react";
import styled from "styled-components";
import UndecoratedLink from "Reusable/UndecoratedLink";
import { clickableText, ClickableTextProps } from "Reusable/css";
import { History, LocationDescriptor } from "history";
import { Link, LinkProps } from "react-router-dom";
import { isUrlAbsolute } from "Utils";

// const StyledLink = styled(UndecoratedLink)`
//   ${clickableText};
// `;

const StyledLink = styled(
  ({
    color,
    backgroundColor,
    ...rest
  }: // }: ClickableTextProps & LinkProps & { ref: React.Ref<Link> }) => {
  ClickableTextProps & {
    ref: any;
    // ref: React.Ref<Link>;
    to: LocationDescriptor<any>;
    children: ReactChild;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  }) => {
    if (isUrlAbsolute(rest.to.toString())) {
      return <a href={rest.to.toString()} target="_blank" {...rest} />;
    } else {
      return <UndecoratedLink {...rest} />;
    }
  }
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
