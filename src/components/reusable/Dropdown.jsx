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
  state = {
    showDropdown: false,
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  renderBtn = () => {
    const { textForBtn, iconForBtn } = this.props;

    if (textForBtn) {
      console.log(`textforbtn`);
      return <TextBtn onClick={this.toggleDropdown}>{textForBtn}</TextBtn>;
    } else if (iconForBtn) {
      return <IconBtn icon={iconForBtn} onClick={this.toggleDropdown} />;
    }
    throw new Error('Dropdown button must be either text or icon.');
  };

  render() {
    const { showDropdown } = this.state;
    const { items, pivot } = this.props;

    return (
      <StyledDropdown>
        {this.renderBtn()}
        {showDropdown && <DropdownList items={items} pivot={pivot} />}
      </StyledDropdown>
    );
  }
}

export default Dropdown;
