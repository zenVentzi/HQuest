import React, { useState, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import DropdownList from "Reusable/DropdownList";
import { useClickOutside } from "use-events";

const StyledDropdown = styled.div`
  display: inline-block;
  position: relative;
`;

interface DropdownProps {
  dropBtn: any;
  pivot: "left" | "right";
  items: any[];
}

const Dropdown = (props: DropdownProps) => {
  const dropdownBtn = useRef<HTMLElement>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonHeight, setButtonHeight] = useState<number>();

  useLayoutEffect(() => {
    setButtonHeight(dropdownBtn.current!.clientHeight);
  }, []);

  const onClickOutside = (e: MouseEvent) => {
    if (isDropdownBtnClicked(e)) return;
    toggleDropdown();
  };

  const onDropdownItemClicked = () => {
    toggleDropdown();
  };

  const isDropdownBtnClicked = (event: MouseEvent) => {
    return (
      event.target === dropdownBtn.current ||
      event.target === dropdownBtn.current!.children[0]
    );
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const renderDropdownBtn = () => {
    const { dropBtn } = props;

    return React.cloneElement(dropBtn, {
      ref: dropdownBtn,
      onClick: () => {
        if (dropBtn.props.onClick) {
          dropBtn.props.onClick();
        }

        toggleDropdown();
      }
    });
  };

  const { items, pivot } = props;

  return (
    <StyledDropdown>
      {renderDropdownBtn()}
      {showDropdown && buttonHeight && (
        <DropdownList
          items={items}
          pivot={pivot}
          marginTop={buttonHeight}
          onItemClicked={onDropdownItemClicked}
          onClickOutside={onClickOutside}
        />
      )}
    </StyledDropdown>
  );
};

export default Dropdown;
