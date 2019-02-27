import React, { Component } from "react";
import styled from "styled-components";
import DropdownList from "Reusable/DropdownList";

const StyledDropdown = styled.div`
  display: inline-block;
  position: relative;
`;

interface DropdownProps {
  dropBtn: any;
  pivot: "left" | "right";
  items: any[];
}

class Dropdown extends Component<DropdownProps> {
  state: any = {
    showDropdown: false
  };

  btnRef = React.createRef<any>();

  componentDidMount() {
    const buttonHeight = this.btnRef.current.clientHeight;
    /* eslint-disable  */
    this.setState(prevState => ({ ...prevState, buttonHeight }));
    /* eslint-enable  */
  }

  onClickOutside = (e: any) => {
    if (this.isDropdownBtnClicked(e)) return;
    this.toggleDropdown();
  };

  onDropdownItemClicked = () => {
    this.toggleDropdown();
  };

  isDropdownBtnClicked = (event: any) => {
    return (
      event.target === this.btnRef.current ||
      event.target === this.btnRef.current.children[0]
    );
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  renderDropdownBtn = () => {
    const { dropBtn } = this.props;

    return React.cloneElement(dropBtn, {
      ref: this.btnRef,
      onClick: () => {
        if (dropBtn.props.onClick) {
          dropBtn.props.onClick();
        }

        this.toggleDropdown();
      }
    });
  };

  render() {
    const { showDropdown, buttonHeight } = this.state;
    const { items, pivot } = this.props;

    return (
      <StyledDropdown>
        {this.renderDropdownBtn()}
        {showDropdown && buttonHeight && (
          <DropdownList
            items={items}
            pivot={pivot}
            marginTop={buttonHeight}
            onItemClicked={this.onDropdownItemClicked}
            onClickOutside={this.onClickOutside}
          />
        )}
      </StyledDropdown>
    );
  }
}

export default Dropdown;
