import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DropdownList from 'Reusable/DropdownList';
import TextBtn from 'Reusable/TextBtn';
import IconBtn from 'Reusable/IconBtn';

const StyledDropdown = styled.div`
  display: inline-block;
  position: relative;
`;

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.btnRef = React.createRef();

    this.state = {
      showDropdown: false,
    };
  }

  onClickOutside = e => {
    if (this.isDropdownBtnClicked(e)) return;
    this.toggleDropdown();
  };

  isDropdownBtnClicked = event => {
    return (
      event.target === this.btnRef.current ||
      event.target === this.btnRef.current.children[0]
    );
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  renderBtn = () => {
    const { textForBtn, iconForBtn } = this.props;

    if (textForBtn) {
      return (
        <TextBtn ref={this.btnRef} onClick={this.toggleDropdown}>
          {textForBtn}
        </TextBtn>
      );
    } else if (iconForBtn) {
      return (
        <IconBtn
          ref={this.btnRef}
          icon={iconForBtn}
          onClick={this.toggleDropdown}
        />
      );
    }
    throw new Error('Dropdown button must be either text or icon.');
  };

  render() {
    const { showDropdown } = this.state;
    const { items, pivot } = this.props;

    return (
      <StyledDropdown>
        {this.renderBtn()}
        {showDropdown && (
          <DropdownList
            items={items}
            pivot={pivot}
            onClickOutside={this.onClickOutside}
          />
        )}
      </StyledDropdown>
    );
  }
}

export default Dropdown;
