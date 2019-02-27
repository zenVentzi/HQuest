import React from "react";
import styled from "styled-components";

const StyledDropdown = styled.div`
  position: absolute;
  top: 2.3em;
  width: 100%;
  z-index: 1;
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  justify-content: center;
  top: 0em;
  max-height: 10em;
  width: 100%;
  background: white;
  border-radius: 0.2em;
`;

const Bottom = styled.div`
  margin-top: 1em;
  width: 100%;
  text-align: center;
  background: black;
`;

interface TagsDropdownProps {
  topComponent: any;
  bottomComponent?: any;
}

const TagsDropdown = ({ topComponent, bottomComponent }: TagsDropdownProps) => {
  return (
    <StyledDropdown>
      <Top>{topComponent}</Top>
      <Bottom>{bottomComponent}</Bottom>
    </StyledDropdown>
  );
};

export default TagsDropdown;
