import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import onClickOutside from "react-onclickoutside";
import { useClickOutside } from "use-events";

interface StyledDropdownProps {
  marginTop: number;
  pivot: "left" | "right";
}

const StyledDropdown = styled.div<StyledDropdownProps>`
  display: flex;
  background: white;
  border-radius: 0.2em;
  color: black;
  top: ${props => props.marginTop};
  ${props => `${props.pivot}: 0`};
  z-index: 1;
  position: absolute;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  align-items: stretch;

  & * {
    white-space: nowrap;
  }
`;

interface DropdownListProps {
  onClickOutside: (e: MouseEvent) => void;
  items: any[];
  onItemClicked: () => void;
  pivot: "left" | "right";
  marginTop: number;
}

const DropdownList = (props: DropdownListProps) => {
  const dropdownList = useRef<HTMLDivElement>();

  useClickOutside(dropdownList, e => {
    props.onClickOutside(e);
  });

  const getModifiedItems = () => {
    const { items, onItemClicked } = props;
    const modifiedItems = items.map(item => {
      return React.cloneElement(item, {
        onClick: () => {
          if (item.props.onClick) {
            item.props.onClick();
          }
          onItemClicked();
        }
      });
    });
    return modifiedItems;
  };

  const { pivot, marginTop } = props;
  const modifiedItems = getModifiedItems();

  return (
    <StyledDropdown ref={dropdownList} marginTop={marginTop} pivot={pivot}>
      <>{modifiedItems}</>
    </StyledDropdown>
  );
};

//@ts-ignore
export default onClickOutside(DropdownList);
