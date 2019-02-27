import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import onClickOutside from "react-onclickoutside";

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
  onClickOutside: (e: any) => void;
  items: any[];
  onItemClicked: () => void;
  pivot: "left" | "right";
  marginTop: number;
}

class DropdownList extends Component<DropdownListProps> {
  static propTypes = {
    pivot: PropTypes.oneOf(["left", "right"])
  };

  handleClickOutside = (e: any) => {
    this.props.onClickOutside(e);
  };

  getModifiedItems = () => {
    const { items, onItemClicked } = this.props;
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

  render() {
    const { pivot, marginTop } = this.props;
    const modifiedItems = this.getModifiedItems();

    return (
      <StyledDropdown marginTop={marginTop} pivot={pivot}>
        <Fragment>{modifiedItems}</Fragment>
      </StyledDropdown>
    );
  }
}

//@ts-ignore
export default onClickOutside(DropdownList);
